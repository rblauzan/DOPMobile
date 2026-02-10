import { useState } from "react";
import { UserAvatar } from "./UserAvatar";
import { UserMenuDropdown } from "./UserMenuDropdown";
import IconBtn from "../IconBtn";

export function UserMenu({ user, onLogout }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <IconBtn
        icon={<UserAvatar />}
        onClick={() => setOpen((v) => !v)}
      ></IconBtn>
      {open && (
        <UserMenuDropdown onClose={() => setOpen(false)} onLogout={onLogout} />
      )}
    </div>
  );
}
