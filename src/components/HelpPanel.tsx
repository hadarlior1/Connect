import { SUPPORT } from "../content/brand";
import { useT } from "../lib/i18n";
import Dialog from "./Dialog";
import Icon from "./Icon";

// Help: general guidance plus EPR support contacts (shown only when filled in brand.ts).
export default function HelpPanel({ onClose }: { onClose: () => void }) {
  const t = useT();
  const links: [string, string, string][] = [];
  if (SUPPORT.phone) links.push(["phone", `tel:${SUPPORT.phone.replace(/[^\d+]/g, "")}`, SUPPORT.phone]);
  if (SUPPORT.whatsapp) links.push(["chat", `https://wa.me/${SUPPORT.whatsapp}`, "WhatsApp"]);
  if (SUPPORT.email) links.push(["mail", `mailto:${SUPPORT.email}`, SUPPORT.email]);
  return (
    <Dialog title={t("helpTitle")} onClose={onClose}>
      <p className="text-[var(--ink-2)]">{t("helpBody")}</p>
      {links.length > 0 && (
        <ul className="mt-4 space-y-2">
          {links.map(([icon, href, label]) => (
            <li key={href}>
              <a href={href} target={icon === "chat" ? "_blank" : undefined} rel="noreferrer" className="flex min-h-12 items-center gap-3 rounded-2xl border border-[var(--line)] px-4 font-medium text-[var(--ink)] hover:border-[var(--brand)] hover:text-[var(--brand)]">
                <Icon name={icon} />
                <span dir="ltr">{label}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </Dialog>
  );
}
