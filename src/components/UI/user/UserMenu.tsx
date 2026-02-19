
import { useId } from "react";
import IconBtn from "../IconBtn";
import { UserAvatar } from "./UserAvatar";
import { IonPopover } from "@ionic/react";
import { UserMenuDropdown } from "./UserMenuDropdown";
import { useHistory } from "react-router-dom";

export function UserMenu({ user }: { user: any }) {
  const triggerId = useId();
  const history = useHistory();

  const goProfile = () => {
    history.push("/profile");
  };

  // Cerrar sesión
  const logout = () => {
    localStorage.clear();
    history.push("/")
  };

  return (
    <>
      <IconBtn id={triggerId} icon={<UserAvatar user={user} />} onClick={() => {}} />
      <IonPopover
        className="user-menu-popover"
        trigger={triggerId}
        triggerAction="click"
        showBackdrop={false}
        side="bottom"
        alignment="end"
        dismissOnSelect={true}
      >
        <UserMenuDropdown onProfile={goProfile} onLogout={logout} />
      </IonPopover>
    </>
  );
}
