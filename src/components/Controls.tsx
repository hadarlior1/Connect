import { useT } from "../lib/i18n";
import UiIcon from "./Icon";

interface Props {
  isFirst: boolean;
  isLast: boolean;
  finished: boolean;
  onPrev: () => void;
  onNext: () => void;
  onReplay: () => void;
  narrate: boolean;
  onToggleNarrate: () => void;
  autoAdvance: boolean;
  onToggleAuto: () => void;
  paused: boolean;
  onTogglePause: () => void;
  /** Playback position of the current step, 0..1. */
  progress: number;
  /** Playback speed of the video / narration. */
  rate: number;
  onRate: (rate: number) => void;
  captions: boolean;
  onToggleCaptions: () => void;
}

export const RATES = [0.75, 1, 1.25, 1.5];

// Media-player bar: previous / big play-pause / next in the middle; replay, sound, speed and
// captions on one side, auto-advance on the other. Arrows follow the reading direction
// (in Hebrew "previous" points right).
const Icon = {
  prev: (
    <svg viewBox="0 0 24 24" className="h-5 w-5 rtl:-scale-x-100" fill="currentColor" aria-hidden="true">
      <path d="M6 5h2v14H6zM9.5 12 18 5v14z" />
    </svg>
  ),
  next: (
    <svg viewBox="0 0 24 24" className="h-5 w-5 rtl:-scale-x-100" fill="currentColor" aria-hidden="true">
      <path d="M16 5h2v14h-2zM14.5 12 6 5v14z" />
    </svg>
  ),
  play: (
    <svg viewBox="0 0 24 24" className="h-7 w-7 rtl:-scale-x-100" fill="currentColor" aria-hidden="true">
      <path d="M8 5v14l11-7z" />
    </svg>
  ),
  pause: (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor" aria-hidden="true">
      <path d="M7 5h4v14H7zM13 5h4v14h-4z" />
    </svg>
  ),
  replay: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 12a8 8 0 1 1-2.34-5.66" />
      <path d="M20 4v5h-5" />
    </svg>
  ),
  soundOn: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 5 6 9H3v6h3l5 4z" fill="currentColor" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" />
    </svg>
  ),
  soundOff: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 5 6 9H3v6h3l5 4z" fill="currentColor" />
      <path d="m16 9 6 6M22 9l-6 6" />
    </svg>
  ),
  auto: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17 2l4 4-4 4" />
      <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
      <path d="M7 22l-4-4 4-4" />
      <path d="M21 13v1a4 4 0 0 1-4 4H3" />
    </svg>
  ),
};

const round =
  "flex items-center justify-center rounded-full transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand)] disabled:cursor-not-allowed disabled:opacity-35";

function Labeled({ label, children, mobile = false }: { label: string; children: React.ReactNode; mobile?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      {children}
      <span className={`text-[0.68rem] text-[var(--ink-3)] md:hidden ${mobile ? "" : "max-md:hidden"}`} aria-hidden="true">
        {label}
      </span>
    </div>
  );
}

export default function Controls(p: Props) {
  const t = useT();
  const toggle = (on: boolean) => (on ? "bg-[var(--brand-50)] text-[var(--brand)]" : "bg-slate-100 text-slate-400");
  const nextRate = RATES[(RATES.indexOf(p.rate) + 1) % RATES.length] ?? 1;
  return (
    <div className="flex flex-col gap-2 md:gap-1">
      {/* playback progress of the current step */}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200" role="progressbar" aria-label={t("explainProgress")} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(p.progress * 100)}>
        <div className="brand-gradient h-full transition-[width] duration-200" style={{ width: `${Math.round(p.progress * 100)}%` }} />
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 md:gap-2">
          <Labeled label={t("replay")}>
            <button type="button" aria-label={t("replayTitle")} title={t("replayTitle")} onClick={p.onReplay} className={`${round} h-9 w-9 md:h-10 md:w-10 bg-slate-100 text-[var(--brand)] hover:bg-slate-200`}>
              {Icon.replay}
            </button>
          </Labeled>
          <Labeled label={p.narrate ? t("sound") : t("muted")}>
            <button type="button" aria-pressed={p.narrate} aria-label={p.narrate ? t("soundOn") : t("soundOff")} title={p.narrate ? t("soundOn") : t("soundOff")} onClick={p.onToggleNarrate} className={`${round} h-9 w-9 md:h-10 md:w-10 ${toggle(p.narrate)}`}>
              {p.narrate ? Icon.soundOn : Icon.soundOff}
            </button>
          </Labeled>
          <Labeled label={t("speed")}>
            <button type="button" aria-label={`${t("speed")}: ${p.rate}×`} title={`${t("speed")}: ${p.rate}×`} onClick={() => p.onRate(nextRate)} className={`${round} h-9 min-w-9 md:h-10 md:min-w-10 bg-slate-100 px-2 text-xs font-bold text-[var(--ink-2)] hover:bg-slate-200`}>
              <span dir="ltr">{p.rate}×</span>
            </button>
          </Labeled>
          <Labeled label={t("captions")}>
            <button type="button" aria-pressed={p.captions} aria-label={p.captions ? t("captionsOn") : t("captionsOff")} title={p.captions ? t("captionsOn") : t("captionsOff")} onClick={p.onToggleCaptions} className={`${round} h-9 w-9 md:h-10 md:w-10 ${toggle(p.captions)}`}>
              <UiIcon name="captions" />
            </button>
          </Labeled>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <Labeled label={t("prev")} mobile>
            <button type="button" aria-label={t("prev")} title={t("prev")} onClick={p.onPrev} disabled={p.isFirst} className={`${round} h-10 w-10 md:h-11 md:w-11 bg-white text-[var(--ink-2)] shadow-sm ring-1 ring-[var(--line)] hover:bg-slate-50`}>
              {Icon.prev}
            </button>
          </Labeled>
          <button type="button" aria-label={p.paused ? t("resume") : t("pause")} title={p.paused ? t("resume") : t("pause")} onClick={p.onTogglePause} className={`${round} brand-gradient h-12 w-12 text-white shadow-md hover:brightness-110`}>
            {p.paused ? Icon.play : Icon.pause}
          </button>
          <Labeled label={p.isLast ? t("finish") : t("next")} mobile>
            <button type="button" aria-label={p.isLast ? t("finish") : t("next")} title={p.isLast ? t("finish") : t("next")} onClick={p.onNext} className={`${round} h-10 w-10 md:h-11 md:w-11 bg-white text-[var(--ink-2)] shadow-sm ring-1 ring-[var(--line)] hover:bg-slate-50`}>
              {p.isLast ? <UiIcon name="award" /> : Icon.next}
            </button>
          </Labeled>
        </div>

        <div className="flex items-center gap-2">
          <Labeled label={p.autoAdvance ? t("auto") : t("manual")}>
            <button type="button" aria-pressed={p.autoAdvance} aria-label={p.autoAdvance ? t("autoOn") : t("autoOff")} title={p.autoAdvance ? t("autoOn") : t("autoOff")} onClick={p.onToggleAuto} className={`${round} h-9 w-9 md:h-10 md:w-10 ${toggle(p.autoAdvance)}`}>
              {Icon.auto}
            </button>
          </Labeled>
        </div>
      </div>

      {p.isLast && p.finished && (
        <p role="status" className="text-center text-sm font-medium text-[var(--brand)]">
          {t("doneAll")}
        </p>
      )}
    </div>
  );
}
