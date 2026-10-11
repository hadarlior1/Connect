import { useState } from "react";
import { quiz } from "../content/quiz";
import { useLang, useT } from "../lib/i18n";
import Dialog from "./Dialog";
import Icon from "./Icon";

const KEY = "epr-training-quiz-v1";

export function loadQuizScores(): Record<string, number> {
  try {
    return JSON.parse(window.localStorage.getItem(KEY) ?? "{}") as Record<string, number>;
  } catch {
    return {};
  }
}

function saveScore(moduleId: string, score: number) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify({ ...loadQuizScores(), [moduleId]: score }));
  } catch {
    /* ignore */
  }
}

export const hasQuiz = (moduleId: string) => (quiz[moduleId]?.length ?? 0) > 0;

interface Props {
  moduleId: string;
  moduleTitle: string;
  onDone: () => void;
}

// Knowledge check after a chapter: one question at a time, instant feedback with the reason.
export default function Quiz({ moduleId, moduleTitle, onDone }: Props) {
  const lang = useLang();
  const t = useT();
  const questions = quiz[moduleId] ?? [];
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const finished = i >= questions.length;

  function finish() {
    saveScore(moduleId, score);
    onDone();
  }

  const q = questions[i];
  return (
    <Dialog title={`${t("quizTitle")} · ${moduleTitle}`} onClose={finish}>
      {finished ? (
        <div className="py-4 text-center">
          <span className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--success)] text-white">
            <Icon name="award" className="h-8 w-8" />
          </span>
          <p className="text-xl font-bold text-[var(--ink)]">{t("quizDone")}</p>
          <p className="mt-1 text-[var(--ink-3)]">
            <bdi dir="ltr">
              {score}/{questions.length}
            </bdi>{" "}
            {t("score")}
          </p>
          <button type="button" onClick={finish} className="cta-solid mt-6">
            {t("continueCourse")}
          </button>
        </div>
      ) : (
        <div>
          <p className="mb-1 text-sm text-[var(--ink-3)]">
            {t("quizIntro")} · <bdi dir="ltr">{i + 1}/{questions.length}</bdi>
          </p>
          <p className="mb-4 text-lg font-semibold text-[var(--ink)]">{q[lang].q}</p>
          <div role="radiogroup" aria-label={q[lang].q} className="space-y-2">
            {q[lang].options.map((opt, k) => {
              const isAnswer = checked && k === q.answer;
              const isWrong = checked && k === picked && k !== q.answer;
              return (
                <button
                  key={k}
                  type="button"
                  role="radio"
                  aria-checked={picked === k}
                  disabled={checked}
                  onClick={() => setPicked(k)}
                  className={`flex min-h-12 w-full items-center gap-3 rounded-2xl border-2 px-4 py-2 text-start transition ${
                    isAnswer ? "border-[var(--success)] bg-[var(--success)]/10" : isWrong ? "border-red-400 bg-red-50" : picked === k ? "border-[var(--brand)] bg-[var(--brand-50)]" : "border-[var(--line)] hover:border-[var(--brand)]/50"
                  }`}
                >
                  <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${picked === k ? "border-[var(--brand)] bg-[var(--brand)] text-white" : "border-slate-300"}`}>
                    {isAnswer && <Icon name="check" className="h-3.5 w-3.5" />}
                  </span>
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>

          {checked && (
            <p role="status" className={`mt-4 rounded-2xl px-4 py-3 text-sm ${picked === q.answer ? "bg-[var(--success)]/10 text-[var(--success-ink)]" : "bg-amber-50 text-amber-900"}`}>
              <strong>{picked === q.answer ? t("correct") : t("wrong")}</strong> {q[lang].explain}
            </p>
          )}

          <div className="mt-5 flex items-center justify-between gap-3">
            <button type="button" onClick={finish} className="min-h-10 text-sm text-[var(--ink-3)] underline-offset-2 hover:underline">
              {t("skipQuiz")}
            </button>
            {checked ? (
              <button
                type="button"
                className="cta-solid"
                onClick={() => {
                  setI(i + 1);
                  setPicked(null);
                  setChecked(false);
                }}
              >
                {i + 1 < questions.length ? t("nextQuestion") : t("quizDone")}
              </button>
            ) : (
              <button
                type="button"
                className="cta-solid"
                disabled={picked === null}
                onClick={() => {
                  setChecked(true);
                  if (picked === q.answer) setScore(score + 1);
                }}
              >
                {t("check")}
              </button>
            )}
          </div>
        </div>
      )}
    </Dialog>
  );
}
