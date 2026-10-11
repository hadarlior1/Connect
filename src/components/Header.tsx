import { LOGO } from "../content/brand";
import { useT } from "../lib/i18n";
import Icon from "./Icon";

interface Props {
  done: number;
  total: number;
  navOpen: boolean;
  onToggleNav: () => void;
  onHome: () => void;
  onToggleLang: () => void;
  onHelp: () => void;
}

const iconBtn =
  "flex h-10 min-w-10 items-center justify-center gap-1.5 rounded-xl px-2 text-sm font-medium text-[var(--ink-2)] transition-colors hover:bg-[var(--brand-50)] hover:text-[var(--brand)] focus-visible:outline-2 focus-visible:outline-[var(--brand)]";

// White top bar: EPR logo and course name, then progress ring, help, language and menu.
export default function Header({ done, total, navOpen, onToggleNav, onHome, onToggleLang, onHelp }: Props) {
  const t = useT();
  const pct = total ? Math.round((done / total) * 100) : 0;
  const r = 15;
  const c = 2 * Math.PI * r;
  return (
    <header className="relative z-20 border-b border-[var(--line)] bg-white">
      <div className="flex items-center gap-2 px-3 py-1.5 md:px-5">
        <button type="button" onClick={onHome} className="flex min-w-0 items-center gap-3 rounded-xl py-1 pe-2 focus-visible:outline-2 focus-visible:outline-[var(--brand)]" aria-label={`${t("brand")} · ${t("home")}`}>
          <img src={LOGO} alt="EPR Systems" className="h-8 w-auto shrink-0 md:h-9" />
          <span className="hidden h-7 w-px bg-[var(--line)] sm:block" aria-hidden="true" />
          <span className="min-w-0 text-start leading-tight">
            <span className="block truncate text-[0.95rem] font-bold text-[var(--ink)]">{t("brand")}</span>
            <span className="block truncate text-xs text-[var(--ink-3)]">{t("courseFull")}</span>
          </span>
        </button>

        <div className="ms-auto flex items-center gap-1">
          <button type="button" onClick={onHome} className={iconBtn} aria-label={t("home")} title={t("home")}>
            <Icon name="home" />
            <span className="hidden md:inline">{t("home")}</span>
          </button>
          <div className="flex items-center gap-2 pe-2" role="group" aria-label={t("progress")} title={`${t("progress")}: ${done} ${t("of")} ${total} ${t("statSteps")}`}>
            <svg viewBox="0 0 36 36" className="h-9 w-9 -rotate-90" role="progressbar" aria-label={t("stepsDone")} aria-valuemin={0} aria-valuemax={total} aria-valuenow={done}>
              <circle cx="18" cy="18" r={r} fill="none" stroke="var(--line)" strokeWidth="3.5" />
              <circle cx="18" cy="18" r={r} fill="none" stroke="url(#ring)" strokeWidth="3.5" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)} style={{ transition: "stroke-dashoffset 400ms ease-out" }} />
              <defs>
                <linearGradient id="ring" x1="0" x2="1">
                  <stop offset="0" stopColor="var(--brand)" />
                  <stop offset="1" stopColor="var(--accent)" />
                </linearGradient>
              </defs>
            </svg>
            <span className="hidden leading-tight sm:block">
              <span className="block text-[0.7rem] text-[var(--ink-3)]">{t("progress")}</span>
              <span className="block text-sm font-bold text-[var(--ink)]">
                <bdi dir="ltr">
                  {done}/{total}
                </bdi>{" "}
                <span className="font-medium text-[var(--ink-3)]">· {pct}%</span>
              </span>
            </span>
          </div>
          <button type="button" onClick={onHelp} className={iconBtn} aria-label={t("help")} title={t("help")}>
            <Icon name="help" />
            <span className="hidden lg:inline">{t("help")}</span>
          </button>
          <button type="button" onClick={onToggleLang} className={iconBtn} aria-label={t("languageLabel")} title={t("languageLabel")}>
            <Icon name="globe" />
            <span className="hidden sm:inline">{t("language")}</span>
          </button>
          <button
            type="button"
            className={`${iconBtn} xl:hidden`}
            aria-label={navOpen ? t("closeMenu") : t("openMenu")}
            aria-expanded={navOpen}
            aria-controls="module-nav"
            onClick={onToggleNav}
          >
            <Icon name={navOpen ? "x" : "menu"} className="h-6 w-6" />
          </button>
        </div>
      </div>
      <div className="brand-gradient h-[3px]" aria-hidden="true" />
    </header>
  );
}
