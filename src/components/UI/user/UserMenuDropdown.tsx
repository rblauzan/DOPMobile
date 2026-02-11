
import { Power, CircleUser } from "lucide-react";
import MenuItem from "../MenuItem";

type Props = {
  onProfile?: () => void;
  onLogout: () => void | Promise<void>;
};

export function UserMenuDropdown({ onProfile, onLogout }: Props) {
  return (
    <div
     
      className="
        py-2
        px-2
        w-fit
        whitespace-nowrap
        rounded-2xl
       bg-white/15 border border-white/20 backdrop-blur-2xl shadow-xl
      "
    >
      <MenuItem
        icon={<CircleUser size={16} />}
        label="Profile"
        onClick={onProfile}
      />

      <div className="h-px bg-white/10 my-1" />

      <MenuItem
        icon={<Power size={16} />}
        label="Log out"
        danger
        onClick={onLogout}
      />
    </div>
  );
}
