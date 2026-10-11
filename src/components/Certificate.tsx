import { useState } from "react";
import { LOGO } from "../content/brand";
import { useLang, useT } from "../lib/i18n";
import Dialog from "./Dialog";
import Icon from "./Icon";

const KEY = "epr-training-cert-name-v1";

function loadName(): string {
  try {
    return window.localStorage.getItem(KEY) ?? "";
  } catch {
    return "";
  }
}

// Certificate of completion: the learner types a name, sees the certificate and prints it
// (the browser's "Save as PDF" makes the file). Only the certificate is printed.
export default function Certificate({ onClose }: { onClose: () => void }) {
  const lang = useLang();
  const t = useT();
  const [name, setName] = useState(loadName);
  const [shown, setShown] = useState(false);
  const date = new Date().toLocaleDateString(lang === "he" ? "he-IL" : "en-GB", { day: "numeric", month: "long", year: "numeric" });

  return (
    <Dialog title={t("certTitle")} onClose={onClose} wide={shown}>
      {!shown ? (
        <form
          className="py-2 text-center"
          onSubmit={(e) => {
            e.preventDefault();
            if (!name.trim()) return;
            try {
              window.localStorage.setItem(KEY, name.trim());
            } catch {
              /* ignore */
            }
            setShown(true);
          }}
        >
          <span className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--brand-50)] text-[var(--brand)]">
            <Icon name="award" className="h-8 w-8" />
          </span>
          <p className="text-xl font-bold text-[var(--ink)]">{t("certCongrats")}</p>
          <label className="mt-5 block text-start text-sm font-medium text-[var(--ink-2)]" htmlFor="cert-name">
            {t("certName")}
          </label>
          <input
            id="cert-name"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 min-h-12 w-full rounded-xl border border-[var(--line)] px-4 text-lg focus:border-[var(--brand)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/20"
          />
          <button type="submit" className="cta-solid mt-5" disabled={!name.trim()}>
            {t("certShow")}
          </button>
        </form>
      ) : (
        <div>
          <div id="certificate" className="certificate relative overflow-hidden rounded-2xl p-8 text-center md:p-12">
            <img src={LOGO} alt="EPR Systems" className="mx-auto h-14 w-auto" />
            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--brand)]">{t("certTitle")}</p>
            <p className="mt-6 text-[var(--ink-3)]">{t("certAwarded")}</p>
            <p className="mt-2 text-4xl font-extrabold text-[var(--ink)] md:text-5xl">{name}</p>
            <p className="mt-6 text-[var(--ink-3)]">{t("certFor")}</p>
            <p className="mt-1 text-2xl font-bold text-[var(--brand)]">{t("courseFull")}</p>
            <div className="mt-10 flex items-end justify-between text-sm text-[var(--ink-2)]">
              <span>
                {t("certDate")}: {date}
              </span>
              <span className="text-end">
                <span className="block font-semibold">{t("presenter")}</span>
                {t("certIssuer")}
              </span>
            </div>
          </div>
          <div className="no-print mt-5 flex justify-center gap-3">
            <button type="button" className="cta-solid" onClick={() => window.print()}>
              {t("certPrint")}
            </button>
            <button type="button" className="cta-outline" onClick={onClose}>
              {t("backToCourse")}
            </button>
          </div>
        </div>
      )}
    </Dialog>
  );
}
