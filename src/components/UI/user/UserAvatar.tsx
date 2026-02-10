import { IonButton, IonAvatar, IonImg } from "@ionic/react";
import { useState } from "react";

export function UserAvatar() {
  const avatarUrl = "https://i.pravatar.cc/150?img=3";
  const [event, setEvent] = useState<MouseEvent | undefined>(undefined);
  return (
    <>
      {/* Avatar button */}
      <IonButton
        fill="clear"
        className="p-0"
        onClick={(e) => {
          setEvent(e.nativeEvent);
        }}
      >
        <IonAvatar className="w-9 h-9 ring-2 ring-white/20">
          {avatarUrl ? (
            <IonImg src={avatarUrl} />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600 text-sm rounded-full">
              U
            </div>
          )}
        </IonAvatar>
      </IonButton>
    </>
  );
}
