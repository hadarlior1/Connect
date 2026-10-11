import type { Lang } from "../lib/i18n";
import { modules } from "./lessons";
import { modulesEn } from "./lessons.en";
import type { Module } from "./types";

// The course in the chosen language: Hebrew as written, English with the same ids, icons
// and screenshot highlights taken from the Hebrew modules.
const english: Module[] = modules.map((m) => {
  const em = modulesEn.find((x) => x.id === m.id);
  return {
    ...m,
    title: em?.title ?? m.title,
    intro: m.intro ? (em?.intro ?? m.intro) : undefined,
    steps: m.steps.map((s) => {
      const es = em?.steps.find((x) => x.id === s.id);
      return es ? { ...s, title: es.title, script: es.script, tip: es.tip, warning: es.warning } : s;
    }),
  };
});

export function modulesFor(lang: Lang): Module[] {
  return lang === "en" ? english : modules;
}

/** Spoken length of a script, in seconds (≈2.3 words a second, as in the recordings). */
export function seconds(text: string): number {
  return text.trim().split(/\s+/).length / 2.3;
}

/** Minutes for a module, rounded up (at least 1). */
export function moduleMinutes(m: Module): number {
  return Math.max(1, Math.ceil(m.steps.reduce((t, s) => t + seconds(s.script), 0) / 60));
}
