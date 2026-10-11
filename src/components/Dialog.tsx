import { useEffect, useRef, type ReactNode } from "react";
import { useT } from "../lib/i18n";
import Icon from "./Icon";

interface Props {
  title: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}

// Modal dialog: dimmed backdrop, focus moved inside, Escape or ✕ closes it.
export default function Dialog({ title, onClose, children, wide = false }: Props) {
  const t = useT();
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div className="dialog-backdrop fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 p-3 backdrop-blur-sm" onClick={onClose}>
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className={`dialog-panel max-h-[92dvh] w-full overflow-y-auto rounded-3xl bg-white shadow-2xl focus:outline-none ${wide ? "max-w-4xl" : "max-w-xl"}`}
      >
        <div className="flex items-center justify-between border-b border-[var(--line)] px-5 py-3">
          <h2 className="text-lg font-bold text-[var(--ink)]">{title}</h2>
          <button type="button" onClick={onClose} aria-label={t("close")} className="flex h-10 w-10 items-center justify-center rounded-xl text-[var(--ink-3)] hover:bg-[var(--brand-50)]">
            <Icon name="x" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
