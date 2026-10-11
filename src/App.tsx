import { useCallback, useEffect, useRef, useState } from "react";
import { allSteps, findStep } from "./content/lessons";
import { modulesFor } from "./content/localized";
import { stepLabel } from "./content/label";
import { loadProgress, markDone, resetProgress, setLast } from "./lib/progress";
import { LangContext, loadLang, saveLang, tFor, type Lang } from "./lib/i18n";
import Header from "./components/Header";
import ModuleNav from "./components/ModuleNav";
import StepStage from "./components/StepStage";
import AvatarPanel from "./components/AvatarPanel";
import Controls, { RATES } from "./components/Controls";
import ProcessStepper from "./components/ProcessStepper";
import Welcome from "./components/Welcome";
import Quiz, { hasQuiz, loadQuizScores } from "./components/Quiz";
import Certificate from "./components/Certificate";
import HelpPanel from "./components/HelpPanel";
import { moduleIntroUrl } from "./lib/media";
import { isNarrationEnabled, setNarrationEnabled, stopSpeaking } from "./lib/speech";

const AUTO_KEY = "muni-training-auto-v1";
const PLAYER_KEY = "epr-training-player-v1";
const AUTO_DELAY_MS = 1500;

function loadAuto(): boolean {
  try {
    return window.localStorage.getItem(AUTO_KEY) !== "off";
  } catch {
    return true;
  }
}

function saveAuto(on: boolean): void {
  try {
    window.localStorage.setItem(AUTO_KEY, on ? "on" : "off");
  } catch {
    /* ignore */
  }
}

function loadPlayer(): { rate: number; captions: boolean } {
  try {
    const p = JSON.parse(window.localStorage.getItem(PLAYER_KEY) ?? "{}") as { rate?: number; captions?: boolean };
    return { rate: RATES.includes(p.rate ?? 1) ? (p.rate ?? 1) : 1, captions: p.captions !== false };
  } catch {
    return { rate: 1, captions: true };
  }
}

function savePlayer(p: { rate: number; captions: boolean }) {
  try {
    window.localStorage.setItem(PLAYER_KEY, JSON.stringify(p));
  } catch {
    /* ignore */
  }
}

// Deep links: #/5.3 opens the step the learner sees as 5.3 (internal id 4.3).
function stepFromHash(): string | undefined {
  const m = /^#\/(\d+)\.(\d+)$/.exec(window.location.hash);
  if (!m) return undefined;
  const id = `${Number(m[1]) - 1}.${m[2]}`;
  return findStep(id) ? id : undefined;
}

function initialIndex(): number {
  const id = stepFromHash() ?? loadProgress().last;
  return (id && findStep(id)?.index) || 0;
}

const SKIP_KEYS_IN = new Set(["INPUT", "TEXTAREA", "SELECT", "VIDEO", "BUTTON", "A"]);

interface AppProps {
  /** Open on the welcome screen (the real site); tests open straight on the course. */
  welcome?: boolean;
}

export default function App({ welcome = false }: AppProps) {
  const [lang, setLang] = useState<Lang>(loadLang);
  const [view, setView] = useState<"welcome" | "course">(() => (welcome && !stepFromHash() ? "welcome" : "course"));
  const [index, setIndex] = useState(initialIndex);
  const [done, setDone] = useState<string[]>(() => loadProgress().done);
  const [navOpen, setNavOpen] = useState(false);
  const [replay, setReplay] = useState(0);
  const [navigated, setNavigated] = useState(false);
  const [narrate, setNarrate] = useState(isNarrationEnabled);
  const [autoAdvance, setAutoAdvance] = useState(loadAuto);
  const [activeWord, setActiveWord] = useState(-1);
  const [introPlaying, setIntroPlaying] = useState(false);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [player, setPlayer] = useState(loadPlayer);
  const [quizFor, setQuizFor] = useState<string | null>(null);
  const [certificate, setCertificate] = useState(false);
  const [help, setHelp] = useState(false);
  const autoTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const modules = modulesFor(lang);
  const steps = modules.flatMap((m) => m.steps);
  const step = steps[index];
  const module = modules.find((m) => m.steps.some((s) => s.id === step.id))!;
  const isFirst = index === 0;
  const isLast = index === steps.length - 1;
  const validIds = new Set(allSteps.map((s) => s.id));
  const doneCount = done.filter((id) => validIds.has(id)).length;
  const isModuleStart = module.steps[0].id === step.id;
  const isModuleEnd = module.steps[module.steps.length - 1].id === step.id;
  const introUrl = isModuleStart && module.intro ? moduleIntroUrl(module.id) : undefined;
  const t = (k: Parameters<typeof tFor>[1]) => tFor(lang, k);
  const blocked = quizFor !== null || certificate || help;

  // Page language and direction follow the chosen language.
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "he" ? "rtl" : "ltr";
    document.title = `${t("courseFull")} | ${t("brand")}`;
  }, [lang]); // eslint-disable-line react-hooks/exhaustive-deps

  function toggleLang() {
    const next: Lang = lang === "he" ? "en" : "he";
    stopSpeaking();
    saveLang(next);
    setLang(next);
    setReplay((r) => r + 1);
  }

  function toggleNarrate() {
    const next = !narrate;
    if (!next) stopSpeaking();
    setNarrationEnabled(next);
    setNarrate(next);
  }

  function updatePlayer(p: Partial<typeof player>) {
    const next = { ...player, ...p };
    savePlayer(next);
    setPlayer(next);
  }

  useEffect(() => {
    if (view !== "course") return;
    setLast(step.id);
    setActiveWord(-1);
    setPaused(false);
    setProgress(0);
    const hash = `#/${stepLabel(step.id)}`;
    if (window.location.hash !== hash) window.history.replaceState(null, "", hash);
    return () => clearTimeout(autoTimer.current);
  }, [step.id, replay, view]);

  // Back/forward or a pasted link: follow the hash.
  useEffect(() => {
    const onHash = () => {
      const id = stepFromHash();
      const f = id && findStep(id);
      if (f) {
        setIndex(f.index);
        setView("course");
      } else if (!window.location.hash) setView(welcome ? "welcome" : "course");
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [welcome]);

  const advance = useCallback(() => {
    if (index < steps.length - 1) {
      setIndex(index + 1);
      setNavigated(true);
    }
  }, [index, steps.length]);

  const goNext = useCallback(() => {
    markDone(steps[index].id);
    setDone(loadProgress().done);
    if (isLast) return setCertificate(true);
    // End of a chapter: a short knowledge check first (once per chapter).
    if (welcome && isModuleEnd && hasQuiz(module.id) && loadQuizScores()[module.id] === undefined) return setQuizFor(module.id);
    advance();
  }, [index, steps, isLast, isModuleEnd, module.id, advance, welcome]);

  const goPrev = useCallback(() => {
    if (index > 0) {
      setIndex(index - 1);
      setNavigated(true);
    }
  }, [index]);

  // Narration finished on its own: move on automatically (when enabled).
  const onNarrationFinished = useCallback(
    (completed: boolean) => {
      setActiveWord(-1);
      clearTimeout(autoTimer.current);
      if (completed && autoAdvance && !isLast) {
        autoTimer.current = setTimeout(goNext, AUTO_DELAY_MS);
      }
    },
    [autoAdvance, isLast, goNext],
  );

  function toggleAuto() {
    const next = !autoAdvance;
    if (!next) clearTimeout(autoTimer.current);
    saveAuto(next);
    setAutoAdvance(next);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") return setNavOpen(false);
      if (view !== "course" || blocked || navOpen || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      const target = e.target as HTMLElement | null;
      if (target?.isContentEditable || (target?.tagName && SKIP_KEYS_IN.has(target.tagName))) return;
      // Arrows follow the reading direction: in Hebrew ← is "next".
      const forward = lang === "he" ? "ArrowLeft" : "ArrowRight";
      const back = lang === "he" ? "ArrowRight" : "ArrowLeft";
      if (e.key === forward) goNext();
      else if (e.key === back) goPrev();
      else if (e.key === " ") {
        e.preventDefault();
        setPaused((v) => !v);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev, navOpen, view, blocked, lang]);

  function select(id: string) {
    const f = findStep(id);
    if (f) {
      setIndex(f.index);
      setNavigated(true);
    }
    setView("course");
    setNavOpen(false);
  }

  function goHome() {
    stopSpeaking();
    setNavOpen(false);
    if (welcome) {
      window.history.replaceState(null, "", window.location.pathname);
      setView("welcome");
    }
  }

  function reset() {
    if (!window.confirm(t("resetConfirm"))) return;
    resetProgress();
    setDone([]);
    setIndex(0);
    setNavOpen(false);
  }

  return (
    <LangContext.Provider value={lang}>
      <div className="flex min-h-dvh flex-col">
        <a href="#main" className="skip-link">
          {lang === "he" ? "דלגו לתוכן" : "Skip to content"}
        </a>
        <div aria-live="polite" className="sr-only">
          {`${t("step")} ${index + 1} ${t("of")} ${steps.length}: ${step.title}`}
        </div>
        <Header
          done={doneCount}
          total={allSteps.length}
          navOpen={navOpen}
          onToggleNav={() => setNavOpen((o) => !o)}
          onHome={goHome}
          onToggleLang={toggleLang}
          onHelp={() => setHelp(true)}
        />

        {view === "welcome" ? (
          <Welcome modules={modules} done={done} resumeId={step.id} onStart={select} />
        ) : (
          /* The contents dock on the side only on wide screens (xl); below that they are a
             drawer opened from the header, so the screenshot gets the full width. */
          <div className="mx-auto grid w-full max-w-[100rem] flex-1 grid-cols-1 content-start gap-3 overflow-x-clip p-3 max-md:pb-32 md:gap-3 md:p-3 xl:grid-cols-[16rem_minmax(0,1fr)]">
            <div className="xl:col-start-1 xl:row-start-1">
              <ModuleNav modules={modules} currentId={step.id} done={done} open={navOpen} onSelect={select} onReset={reset} onClose={() => setNavOpen(false)} />
            </div>
            <main id="main" className="flex min-w-0 flex-col gap-2 xl:col-start-2 xl:row-start-1">
              <ProcessStepper modules={modules} currentId={step.id} done={done} onSelect={select} />
              <StepStage
                key={`${step.id}-${lang}`}
                module={module}
                step={step}
                focusTitle={navigated}
                activeWord={activeWord}
                captionText={introPlaying ? module.intro : undefined}
                showCaptions={player.captions}
                presenter={
                  <AvatarPanel
                    key={`${step.id}-${replay}-${lang}`}
                    step={step}
                    introUrl={introUrl}
                    introText={module.intro}
                    onIntro={setIntroPlaying}
                    narrate={narrate && !blocked}
                    onWord={setActiveWord}
                    onFinished={onNarrationFinished}
                    paused={paused || blocked}
                    onProgress={setProgress}
                    rate={player.rate}
                  />
                }
              />
              <div className="player-bar z-10 bg-white/95 px-3 py-2 backdrop-blur max-md:fixed max-md:inset-x-0 max-md:bottom-0 max-md:border-t max-md:border-[var(--line)] max-md:pb-[max(0.5rem,env(safe-area-inset-bottom))] md:sticky md:bottom-0 md:rounded-2xl md:border md:border-[var(--line)] md:py-1.5">
                <Controls
                  isFirst={isFirst}
                  isLast={isLast}
                  finished={done.includes(step.id)}
                  onPrev={goPrev}
                  onNext={goNext}
                  onReplay={() => setReplay((r) => r + 1)}
                  narrate={narrate}
                  onToggleNarrate={toggleNarrate}
                  autoAdvance={autoAdvance}
                  onToggleAuto={toggleAuto}
                  paused={paused}
                  onTogglePause={() => setPaused((v) => !v)}
                  progress={progress}
                  rate={player.rate}
                  onRate={(rate) => updatePlayer({ rate })}
                  captions={player.captions}
                  onToggleCaptions={() => updatePlayer({ captions: !player.captions })}
                />
              </div>
            </main>
          </div>
        )}

        {quizFor && (
          <Quiz
            moduleId={quizFor}
            moduleTitle={module.title}
            onDone={() => {
              setQuizFor(null);
              advance();
            }}
          />
        )}
        {certificate && <Certificate onClose={() => setCertificate(false)} />}
        {help && <HelpPanel onClose={() => setHelp(false)} />}
      </div>
    </LangContext.Provider>
  );
}
