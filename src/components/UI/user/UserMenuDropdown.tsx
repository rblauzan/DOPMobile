import { Power, CircleUser } from "lucide-react";
import MenuItem from "../MenuItem";
import { useTranslation } from "react-i18next";

type Props = {
  onProfile?: () => void;
  onLogout: () => void | Promise<void>;
};

export function UserMenuDropdown({ onProfile, onLogout }: Props) {
  const { t } = useTranslation("");
  return (
    <div
    className="
    py-2 px-2 w-fit whitespace-nowrap rounded-2xl
    bg-slate-500/75 border border-white/20
    backdrop-blur-2xl shadow-xl
  "
    >
      <MenuItem
        icon={<CircleUser size={16} />}
        label={t("UserMenuDropdown.profile")}
        onClick={onProfile}
      />

      <div className="h-px bg-white/10 my-1" />

      <MenuItem
        icon={<Power size={16} />}
        label={t("UserMenuDropdown.logout")}
        danger
        onClick={onLogout}
      />
    </div>
  );
}
