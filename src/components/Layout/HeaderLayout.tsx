import { useTranslation } from "react-i18next";
import LanguagePillToggle from "../UI/LanguagePills";

export default function HeaderLayout({ title, rightSlot }) {
  const { t } = useTranslation("");
  return (
    <div className="px-4 pt-6 pb-4 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold">{title}</h1>
        
      </div>

      <div className="flex items-center gap-2">
        <LanguagePillToggle />
        {rightSlot}      
      
      </div>
    </div>
  );
}
