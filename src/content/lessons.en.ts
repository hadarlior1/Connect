// English course text, matched to lessons.ts by id. The EprConnect training is Hebrew only
// (the language switch is hidden), so this is empty and every step falls back to Hebrew.

export interface EnStep { id: string; title: string; script: string; tip?: string; warning?: string }
export interface EnModule { id: string; title: string; intro?: string; steps: EnStep[] }

export const modulesEn: EnModule[] = [];
