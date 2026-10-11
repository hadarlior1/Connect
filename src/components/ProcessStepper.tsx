import { useEffect, useRef } from "react";
import type { Module } from "../content/types";
import { stepLabel } from "../content/label";
import { useT } from "../lib/i18n";
import Icon, { MODULE_ICON } from "./Icon";

interface Props {
  modules: Module[];
  currentId: string;
  done: string[];
  onSelect: (stepId: string) => void;
}

type State = "done" | "current" | "todo";

function moduleState(m: Module, currentId: string, done: Set<string>): State {
  if (m.steps.some((s) => s.id === currentId)) return "current";
  return m.steps.every((s) => done.has(s.id)) ? "done" : "todo";
}

const circle: Record<State, string> = {
  done: "bg-[var(--success)] text-white border-[var(--success)]",
  current: "brand-gradient text-white border-transparent ring-4 ring-[var(--brand)]/20",
  todo: "bg-white text-[var(--ink-3)] border-slate-300",
};

// Where am I: the chapter (circles below xl, where there is no sidebar) and the steps of
// the current chapter as numbered dots. Every circle and dot jumps there.
export default function ProcessStepper({ modules, currentId, done, onSelect }: Props) {
  const t = useT();
  const doneSet = new Set(done);
  const mi = Math.max(0, modules.findIndex((m) => m.steps.some((s) => s.id === currentId)));
  const current = modules[mi];
  const stepIndex = current.steps.findIndex((s) => s.id === currentId);
  const currentRef = useRef<HTMLLIElement>(null);
  // On a phone only a few chapters fit: keep the current one in view (horizontal scroll only).
  useEffect(() => {
    const li = currentRef.current;
    const strip = li?.parentElement;
    if (!li || !strip || strip.scrollWidth <= strip.clientWidth) return;
    li.scrollIntoView?.({ inline: "center", block: "nearest", behavior: "smooth" });
  }, [current.id]);

  return (
    <nav aria-label={t("lessons")} className="rounded-2xl border border-[var(--line)] bg-white px-3 py-2 md:flex md:items-center md:gap-4 md:px-4">
      <ol className="flex items-center overflow-x-auto pb-1 md:flex-1 md:pb-0 xl:hidden" data-testid="process-stepper">
        {modules.map((m, i) => {
          const st = moduleState(m, currentId, doneSet);
          return (
            <li key={m.id} ref={st === "current" ? currentRef : undefined} className="flex min-w-[2.75rem] flex-1 items-center">
              <button
                type="button"
                onClick={() => onSelect(m.steps[0].id)}
                aria-current={st === "current" ? "step" : undefined}
                aria-label={`${t("topic")} ${i + 1}: ${m.title}${st === "done" ? ` (${t("completed")})` : ""}`}
                title={m.title}
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold transition hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand)] ${circle[st]}`}
              >
                {st === "done" ? <Icon name="check" className="h-4 w-4" /> : i + 1}
              </button>
              {i < modules.length - 1 && <span aria-hidden="true" className={`mx-1 h-0.5 min-w-2 flex-1 rounded ${st === "done" ? "bg-[var(--success)]" : "bg-slate-200"}`} />}
            </li>
          );
        })}
      </ol>

      {/* Wide screens: the chapter as text (the sidebar lists all chapters). */}
      <div className="hidden min-w-0 flex-1 items-center gap-2 xl:flex">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--brand-50)] text-[var(--brand)]" aria-hidden="true">
          <Icon name={MODULE_ICON[current.id]} className="h-4.5 w-4.5" />
        </span>
        <span className="truncate text-sm font-bold text-[var(--ink)]">
          {t("topic")} {mi + 1}: {current.title}
        </span>
      </div>

      <div className="mt-2 flex flex-wrap items-center justify-center gap-2 border-t border-[var(--line)] pt-2 md:mt-0 md:flex-nowrap md:border-t-0 md:pt-0" data-testid="step-dots">
        <span className="text-xs text-[var(--ink-3)] md:hidden xl:inline">
          {t("step")} {stepIndex + 1} {t("of")} {current.steps.length}
        </span>
        <ol className="flex flex-wrap items-center gap-1.5">
          {current.steps.map((s, i) => {
            const isCur = s.id === currentId;
            const isDone = doneSet.has(s.id);
            return (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => onSelect(s.id)}
                  aria-current={isCur ? "step" : undefined}
                  aria-label={`${t("step")} ${stepLabel(s.id)}: ${s.title}`}
                  title={s.title}
                  className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold transition hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand)] ${
                    isCur
                      ? "border-[var(--brand)] bg-[var(--brand)] text-white"
                      : isDone
                        ? "border-[var(--success)] bg-[var(--success)]/12 text-[var(--success-ink)]"
                        : "border-slate-300 bg-white text-[var(--ink-3)]"
                  }`}
                >
                  {i + 1}
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
