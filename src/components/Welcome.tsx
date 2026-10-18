import type { Module } from "../content/types";
import { moduleMinutes, seconds } from "../content/localized";
import { stepLabel } from "../content/label";
import { LOGO } from "../content/brand";
import { useT } from "../lib/i18n";
import Icon, { MODULE_ICON } from "./Icon";

interface Props {
  modules: Module[];
  done: string[];
  /** Step to resume at, when the learner has already started. */
  resumeId?: string;
  onStart: (stepId: string) => void;
}

// Landing screen: the promise, the presenter, the course at a glance and the chapters.
export default function Welcome({ modules, done, resumeId, onStart }: Props) {
  const t = useT();
  const steps = modules.flatMap((m) => m.steps);
  // Whole course, rounded once (rounding each chapter up would overstate it).
  const minutes = Math.round(steps.reduce((n, st) => n + seconds(st.script), 0) / 60);
  const started = done.length > 0 && resumeId;
  const resumeStep = steps.find((s) => s.id === resumeId);

  const stats: [string, string, string][] = [
    ["layers", String(modules.length - 1), t("statTopics")],
    ["check", String(steps.length), t("statSteps")],
    ["clock", `~${minutes}`, t("statMinutes")],
    ["award", "1", t("statCert")],
  ];

  return (
    <main className="mx-auto w-full max-w-[90rem] px-3 pb-10 pt-3 md:px-5">
      <section className="hero relative overflow-hidden rounded-3xl px-6 py-8 text-white md:px-12 md:py-12">
        <div className="relative z-10 grid items-center gap-8 md:grid-cols-[minmax(0,1fr)_auto]">
          <div className="max-w-3xl">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-1 text-sm font-medium ring-1 ring-white/25 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-[var(--accent)]" aria-hidden="true" />
              {t("heroEyebrow")}
            </p>
            <h1 className="hero-title text-balance font-extrabold leading-[1.08] tracking-tight">{t("heroPromise")}</h1>
            <p className="mt-5 max-w-2xl text-pretty text-base text-white/85 md:text-lg">{t("heroSub")}</p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              {started && resumeStep ? (
                <>
                  <button type="button" onClick={() => onStart(resumeStep.id)} className="cta">
                    <Icon name="play" className="h-5 w-5 rtl:-scale-x-100" />
                    {t("heroContinue")} · <bdi dir="ltr">{stepLabel(resumeStep.id)}</bdi>
                  </button>
                  <button type="button" onClick={() => onStart(steps[0].id)} className="cta-ghost">
                    {t("heroRestart")}
                  </button>
                </>
              ) : (
                <button type="button" onClick={() => onStart(steps[0].id)} className="cta">
                  <Icon name="play" className="h-5 w-5 rtl:-scale-x-100" />
                  {t("heroStart")}
                </button>
              )}
            </div>

            <ul className="mt-8 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
              {stats.map(([icon, value, label]) => (
                <li key={label} className="rounded-2xl bg-white/10 px-4 py-3 ring-1 ring-white/15 backdrop-blur">
                  <Icon name={icon} className="mb-1 h-5 w-5 text-[var(--accent-soft)]" />
                  <span className="block text-2xl font-extrabold leading-none" dir="ltr">
                    {value}
                  </span>
                  <span className="text-sm text-white/80">{label}</span>
                </li>
              ))}
            </ul>
          </div>

          <figure className="relative mx-auto hidden w-[clamp(12rem,22vw,19rem)] md:block">
            <div className="absolute inset-x-0 bottom-0 top-1/4 rounded-full bg-[var(--accent)]/30 blur-3xl" aria-hidden="true" />
            <img src="/brand/hero.webp" alt="EprConnect" className="relative drop-shadow-2xl" width={520} height={550} />
            <figcaption className="absolute bottom-6 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 whitespace-nowrap rounded-full bg-white px-4 py-1.5 text-center text-sm text-[var(--ink)] shadow-lg">
              <strong>{t("presenter")}</strong>
              <span className="block text-xs text-[var(--ink-3)]">{t("presenterRole")}</span>
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="mt-8" aria-labelledby="modules-title">
        <h2 id="modules-title" className="mb-4 text-xl font-bold text-[var(--ink)] md:text-2xl">
          {t("modulesTitle")}
        </h2>
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {modules
            .filter((m) => m.id !== "0")
            .map((m, i) => {
              const n = m.steps.filter((s) => done.includes(s.id)).length;
              const status = n === m.steps.length ? t("completed") : n > 0 ? t("inProgress") : t("notStarted");
              const all = n === m.steps.length;
              return (
                <li key={m.id}>
                  <button type="button" onClick={() => onStart(m.steps[0].id)} className="module-card group h-full w-full text-start">
                    <span className="flex items-start justify-between gap-2">
                      <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${all ? "bg-[var(--success)] text-white" : "bg-[var(--brand-50)] text-[var(--brand)]"}`}>
                        <Icon name={all ? "check" : MODULE_ICON[m.id]} className="h-5 w-5" />
                      </span>
                      <span className="text-xs font-semibold text-[var(--ink-3)]" dir="ltr">
                        {i + 1}/{modules.length - 1}
                      </span>
                    </span>
                    <span className="mt-3 block text-base font-bold text-[var(--ink)] group-hover:text-[var(--brand)]">{m.title}</span>
                    <span className="mt-1 flex items-center gap-3 text-sm text-[var(--ink-3)]">
                      <span className="inline-flex items-center gap-1">
                        <Icon name="clock" className="h-4 w-4" />
                        {moduleMinutes(m)} {t("minutes")}
                      </span>
                      <span>
                        {m.steps.length} {t("statSteps")}
                      </span>
                    </span>
                    <span className="mt-3 block h-1.5 overflow-hidden rounded-full bg-slate-100">
                      <span className="brand-gradient block h-full" style={{ width: `${(n / m.steps.length) * 100}%` }} />
                    </span>
                    <span className="mt-1.5 block text-xs text-[var(--ink-3)]">{status}</span>
                  </button>
                </li>
              );
            })}
        </ol>
      </section>

      <footer className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--line)] pt-5 text-sm text-[var(--ink-3)]">
        <span className="flex items-center gap-3">
          <img src={LOGO} alt="EPR Systems" className="h-7 w-auto" />
          {t("trust")}
        </span>
        <span dir="ltr">© {new Date().getFullYear()} EPR Systems Ltd</span>
      </footer>
    </main>
  );
}
