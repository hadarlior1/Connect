import { useEffect, useRef } from "react";
import type { Module } from "../content/types";
import { stepLabel } from "../content/label";
import { moduleMinutes } from "../content/localized";
import { useT } from "../lib/i18n";
import Icon, { MODULE_ICON } from "./Icon";

interface Props {
  modules: Module[];
  currentId: string;
  done: string[];
  open: boolean;
  onSelect: (id: string) => void;
  onReset: () => void;
  onClose: () => void;
}

// Course contents: docked on wide screens, a drawer below xl.
export default function ModuleNav({ modules, currentId, done, open, onSelect, onReset, onClose }: Props) {
  const t = useT();
  const currentRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    currentRef.current?.scrollIntoView?.({ block: "nearest" });
  }, [currentId]);

  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-slate-900/50 xl:hidden" aria-hidden="true" onClick={onClose} />}
      <nav
        id="module-nav"
        aria-label={t("contents")}
        className={`fixed inset-y-0 start-0 z-40 flex w-80 max-w-[85vw] flex-col bg-white shadow-xl transition-transform duration-200 xl:sticky xl:top-3 xl:bottom-auto xl:z-auto xl:max-h-[calc(100dvh-5.5rem)] xl:max-w-none xl:shrink-0 xl:translate-x-0 xl:self-start xl:rounded-2xl xl:border xl:border-[var(--line)] xl:shadow-none xl:w-auto ${
          open ? "translate-x-0" : "max-xl:invisible max-xl:ltr:-translate-x-full max-xl:rtl:translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-[var(--line)] px-4 py-3">
          <span className="font-bold text-[var(--ink)]">{t("contents")}</span>
          <button type="button" className="flex h-10 w-10 items-center justify-center rounded-xl text-[var(--ink-3)] hover:bg-[var(--brand-50)] xl:hidden" aria-label={t("closeMenu")} onClick={onClose}>
            <Icon name="x" />
          </button>
        </div>
        <ol className="flex-1 space-y-4 overflow-y-auto p-3">
          {modules.map((m, mi) => {
            const completed = m.steps.filter((s) => done.includes(s.id)).length;
            const all = completed === m.steps.length;
            return (
              <li key={m.id}>
                <div className="mb-1 flex items-center gap-2 px-2">
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${all ? "bg-[var(--success)] text-white" : "bg-[var(--brand-50)] text-[var(--brand)]"}`} aria-hidden="true">
                    <Icon name={all ? "check" : MODULE_ICON[m.id]} className="h-4 w-4" />
                  </span>
                  <span className="flex-1 text-sm font-bold text-[var(--ink)]">
                    <span className="text-[var(--ink-3)]">{mi + 1}. </span>
                    {m.title}
                  </span>
                  <span className="text-xs text-[var(--ink-3)]" dir="ltr">
                    {completed}/{m.steps.length} · {moduleMinutes(m)}′
                  </span>
                </div>
                <ol className="space-y-0.5 ps-3">
                  {m.steps.map((s) => {
                    const isCurrent = s.id === currentId;
                    const isDone = done.includes(s.id);
                    return (
                      <li key={s.id}>
                        <button
                          type="button"
                          ref={isCurrent ? currentRef : undefined}
                          aria-current={isCurrent ? "step" : undefined}
                          onClick={() => onSelect(s.id)}
                          className={`flex min-h-10 w-full items-center gap-2 rounded-xl px-2 py-1.5 text-start text-sm transition-colors focus-visible:outline-2 focus-visible:outline-[var(--brand)] ${
                            isCurrent ? "bg-[var(--brand-50)] font-semibold text-[var(--brand)]" : "text-[var(--ink-2)] hover:bg-slate-50"
                          }`}
                        >
                          <span
                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] ${
                              isDone ? "bg-[var(--success)] text-white" : isCurrent ? "bg-[var(--brand)] text-white" : "bg-slate-100 text-[var(--ink-3)]"
                            }`}
                            aria-hidden="true"
                          >
                            {isDone ? <Icon name="check" className="h-3.5 w-3.5" /> : stepLabel(s.id)}
                          </span>
                          <span className="flex-1">{s.title}</span>
                          {isDone && <span className="sr-only">({t("completed")})</span>}
                        </button>
                      </li>
                    );
                  })}
                </ol>
              </li>
            );
          })}
        </ol>
        <div className="border-t border-[var(--line)] px-4 py-2 text-center">
          <button type="button" onClick={onReset} className="min-h-8 text-xs text-[var(--ink-3)] underline-offset-2 hover:text-[var(--brand)] hover:underline">
            {t("resetProgress")}
          </button>
        </div>
      </nav>
    </>
  );
}
