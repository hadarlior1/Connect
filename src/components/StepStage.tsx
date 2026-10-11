import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import type { Module, Step } from "../content/types";
import { screenUrl } from "../lib/media";
import KaraokeText from "./KaraokeText";
import { stepLabel } from "../content/label";
import { sentenceRange } from "../lib/words";
import { useT } from "../lib/i18n";
import Icon, { MODULE_ICON } from "./Icon";

interface Props {
  module: Module;
  step: Step;
  focusTitle?: boolean;
  /** Word being narrated; highlighted in the caption. */
  activeWord?: number;
  /** Text being spoken now when it is not the step script (the module opening video). */
  captionText?: string;
  /** Floating presenter (avatar) drawn over a corner of the screenshot. */
  presenter?: ReactNode;
  /** Side arrows on the screenshot (previous / next screen). */
  onPrev?: () => void;
  onNext?: () => void;
  canPrev?: boolean;
  canNext?: boolean;
  /** Subtitles under the screenshot (the player's captions switch). */
  showCaptions?: boolean;
}

function HighlightRing({ step }: { step: Step }) {
  const h = step.highlight;
  if (!h) return null;
  return (
    <div
      data-testid="highlight"
      className="highlight-ring spotlight pointer-events-none absolute"
      style={{ left: `${h.x}%`, top: `${h.y}%`, width: `${h.w}%`, height: `${h.h}%` }}
      aria-hidden="true"
    />
  );
}

function Placeholder({ module, step }: Props) {
  const t = useT();
  return (
    <div
      data-testid="screen-placeholder"
      className="flex aspect-[16/10] w-full flex-col items-center justify-center gap-3 rounded-xl bg-[var(--brand-50)] p-6 text-center"
    >
      <Icon name={MODULE_ICON[module.id]} className="h-12 w-12 text-[var(--brand)]" />
      <p className="text-xl font-bold text-[var(--brand)] md:text-2xl">{step.title}</p>
      <p className="text-sm text-[var(--ink-3)]">{t("screenSoon")}</p>
    </div>
  );
}

// Height left for the screenshot: the window minus everything around it (`chromeRem`).
function useFitHeight(chromeRem: number): number {
  const get = () => {
    if (typeof window === "undefined") return 400;
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    return Math.max(260, window.innerHeight - chromeRem * rem);
  };
  const [h, setH] = useState(get);
  useEffect(() => {
    const on = () => setH(get());
    on();
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, [chromeRem]);
  return h;
}

// Phones: true below the md breakpoint (768px).
function useIsMobile(): boolean {
  const query = "(max-width: 767px)";
  const get = () => typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia(query).matches;
  const [mobile, setMobile] = useState(get);
  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const mq = window.matchMedia(query);
    const on = () => setMobile(mq.matches);
    mq.addEventListener?.("change", on);
    return () => mq.removeEventListener?.("change", on);
  }, []);
  return mobile;
}

// The screenshot is zoomed onto the highlighted area so it is readable: on phones by a
// fixed factor; on wider screens (`fitH` = the height available for it) so the area fills
// the full-width frame. Returns the frame height and the zoomed image box (px), or null.
function useZoom(step: Step, enabled: boolean, frameRef: React.RefObject<HTMLDivElement | null>, ratio: number | null, fitH?: number) {
  const [box, setBox] = useState<{ frameH: number; w: number; left: number; top: number } | null>(null);
  useLayoutEffect(() => {
    // Wide screens: a step without a marked area is shown full width from its top.
    const h = step.highlight ?? (fitH ? { x: 0, y: 0, w: 100, h: 100 } : undefined);
    const el = frameRef.current;
    if (!enabled || !h || !el || !ratio) return setBox(null);
    const calc = () => {
      const W = el.clientWidth;
      let zoom = Math.min(3, Math.max(1.5, 75 / h.w));
      if (fitH) {
        const fill = (fitH * ratio) / W; // image as tall as the frame
        const byW = 60 / h.w; // highlighted area ≈ 60% of the width (keeps its surroundings)
        const byH = (0.6 * fitH * ratio * 100) / (h.h * W); // …and of the height
        zoom = Math.max(1, fill, Math.min(byW, byH, 1.9));
      }
      const w = W * zoom;
      const innerH = w / ratio;
      const frameH = fitH ? Math.min(fitH, innerH) : Math.min(W * 0.8, innerH);
      const cx = ((h.x + h.w / 2) / 100) * w;
      const cy = ((h.y + h.h / 2) / 100) * innerH;
      const left = Math.min(0, Math.max(W - w, W / 2 - cx));
      const top = Math.min(0, Math.max(frameH - innerH, frameH / 2 - cy));
      setBox({ frameH, w, left, top });
    };
    calc();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(calc) : null;
    ro?.observe(el);
    return () => ro?.disconnect();
  }, [step, enabled, frameRef, ratio, fitH]);
  return box;
}


export default function StepStage({ module, step, focusTitle = false, activeWord = -1, captionText, presenter, showCaptions = true }: Props) {
  const t = useT();
  const [failed, setFailed] = useState<string | null>(null);
  const [loaded, setLoaded] = useState<string | null>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (focusTitle) titleRef.current?.focus();
  }, [focusTitle]);
  const showImage = failed !== step.id;
  const isMobile = useIsMobile();
  const [ratio, setRatio] = useState<number | null>(null);
  const [fullView, setFullView] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);
  const fitH = useFitHeight(step.tip || step.warning ? 23.75 : 21);
  const zoom = useZoom(step, !fullView && showImage, frameRef, ratio, isMobile ? undefined : fitH);
  const spoken = captionText ?? step.script;
  const panRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const el = panRef.current;
    if (zoom && el) el.scrollTo?.({ left: -zoom.left, top: step.highlight ? -zoom.top : 0 });
  }, [zoom, step.highlight]);

  return (
    <section aria-labelledby="step-title" className="rounded-2xl border border-[var(--line)] bg-white p-3 md:px-3 md:py-2">
      <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1 md:mb-1.5">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--brand-50)] px-3 py-1 text-xs font-semibold text-[var(--brand)]">
          <Icon name={MODULE_ICON[module.id]} className="h-3.5 w-3.5" />
          {module.title} · {t("step")} <bdi dir="ltr">{stepLabel(step.id)}</bdi>
        </span>
        <h2 id="step-title" ref={titleRef} tabIndex={-1} className="text-xl font-bold text-[var(--ink)] focus:outline-none md:text-lg">
          {step.title}
        </h2>
      </div>

      {/* Width is capped from viewport height so image + ring scale together (keeps % coords exact). */}
      <div className={`relative mx-auto w-full ${zoom && !isMobile ? "" : "stage-fit"} ${step.tip || step.warning ? "has-notes" : ""}`}>
        {showImage ? (
          <div ref={frameRef} className="relative overflow-hidden rounded-xl border border-slate-100" style={zoom ? { height: zoom.frameH } : undefined}>
            {/* Zoomed: a scroll box opened on the marked area, so the rest can be reached by scrolling or dragging. */}
            <div ref={panRef} dir="ltr" className={zoom ? "pan-box absolute inset-0 overflow-auto overscroll-contain" : "contents"}>
            <div className="relative" style={zoom ? { width: zoom.w } : undefined}>
              <img
                key={step.id}
                data-role="screen"
                src={screenUrl(step.id)}
                alt={`${t("screenshot")}: ${step.title}`}
                className={`block w-full ${loaded === step.id ? "" : "invisible"}`}
                onLoad={(e) => {
                  setLoaded(step.id);
                  const im = e.currentTarget;
                  if (im.naturalHeight) setRatio(im.naturalWidth / im.naturalHeight);
                }}
                onError={() => setFailed(step.id)}
              />
              <HighlightRing step={step} />
            </div>
            </div>
            {(step.highlight || zoom || fullView) && (
              <button
                type="button"
                onClick={() => setFullView((v) => !v)}
                className="absolute bottom-2 right-2 z-30 inline-flex min-h-8 items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-[var(--brand)] shadow-md ring-1 ring-[var(--line)] backdrop-blur hover:bg-white"
              >
                <Icon name={fullView ? "zoom" : "expand"} className="h-3.5 w-3.5" />
                {fullView ? (step.highlight ? t("focusArea") : t("enlarge")) : t("wholeScreen")}
              </button>
            )}
          </div>
        ) : (
          <div className="relative">
            <Placeholder module={module} step={step} />
            <HighlightRing step={step} />
          </div>
        )}
        {presenter && (
          // Always the same corner (bottom-left) so the presenter never jumps between steps.
          <div
            data-testid="presenter-slot"
            style={{ ["--tilt" as string]: -1 }}
            className="presenter-slot absolute bottom-2 left-2 z-20 w-16 md:bottom-0 md:left-1 md:w-[clamp(56px,10%,150px)] md:translate-y-[4%] md:-translate-x-[34%]"
          >
            {presenter}
          </div>
        )}
      </div>

      {/* Subtitles: the sentence being spoken, like a video's captions. Fixed height, so nothing jumps. */}
      <div data-testid="caption" className={`subtitles ${showCaptions ? "" : "sr-only"}`}>
        <p>
          <KaraokeText text={spoken} active={activeWord} range={sentenceRange(spoken, Math.max(activeWord, 0))} />
        </p>
      </div>

      {(step.warning || step.tip) && (
        <div className="mt-2 flex flex-col gap-1.5">
          {step.warning && (
            <p role="note" className="note note-warn">
              <Icon name="alert" className="inline h-4 w-4 align-[-3px]" /> <strong>{t("note")}</strong> {step.warning}
            </p>
          )}
          {step.tip && (
            <p className="note note-tip">
              <Icon name="lightbulb" className="inline h-4 w-4 align-[-3px]" /> <strong>{t("tip")}</strong> {step.tip}
            </p>
          )}
        </div>
      )}

      <details className="transcript mt-2">
        <summary>{t("transcript")}</summary>
        <p data-testid="transcript">
          <KaraokeText text={step.script} active={captionText ? -1 : activeWord} />
        </p>
      </details>
    </section>
  );
}
