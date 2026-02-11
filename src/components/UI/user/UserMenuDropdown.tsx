import { Power, CircleUser } from "lucide-react";
import { useEffect, useRef } from "react";
import MenuItem from "../MenuItem";

export function UserMenuDropdown({ onClose, onLogout }) {
  const ref = useRef(null);

  useEffect(() => {
    const close = (e) => !ref.current?.contains(e.target) && onClose();
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [onClose]);

  return (
    <div
      ref={ref}
      style={{transform:'translateZ(0)'}}
      className="fixed right-5 top-2 py-1 z-50 w-36 h-25  rounded-xl bg-white/15 border border-white/20 backdrop-blur-xl shadow-xl "
    >
      <MenuItem icon={<CircleUser size={16} />} label="Profile" onClick={undefined} />

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
