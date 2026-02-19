// import { Badge } from "lucide-react";
// import IconBtn from "./IconBtn";

// export default function CardSkeleton() {
//   return (
//     <div className="rounded-3xl p-4 bg-white/15 border border-white/20 backdrop-blur-2xl shadow-xl">
//      <div className="flex justify-between gap-3">               
//                   <h3 className="text-lg font-semibold"></h3>
//                   <p className="text-xs opacity-70"></p>

//                   <div className="mt-2 flex flex-wrap gap-2">
//                     <Badge />
//                     <Badge />
//                     <Badge />
//                   </div>

//                 <div className="flex flex-col gap-2">
//                   <IconBtn />
//                   <IconBtn />
//                   <IconBtn />
//                 </div>
//               </div>
//               </div>
//   );
// }
import { IonSkeletonText } from "@ionic/react";

export function EmployeesSkeleton() {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="rounded-3xl bg-white/10 border border-white/20 backdrop-blur-xl p-4"
        >
          <div className="flex justify-between gap-3">
            <div className="flex-1">
              <IonSkeletonText animated style={{ width: "60%", height: 18 }} />
              <div className="mt-2">
                <IonSkeletonText animated style={{ width: "35%", height: 12 }} />
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <IonSkeletonText animated style={{ width: 90, height: 22, borderRadius: 999 }} />
                <IonSkeletonText animated style={{ width: 90, height: 22, borderRadius: 999 }} />
                <IonSkeletonText animated style={{ width: 70, height: 22, borderRadius: 999 }} />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <IonSkeletonText animated style={{ width: 36, height: 36, borderRadius: 12 }} />
              <IonSkeletonText animated style={{ width: 36, height: 36, borderRadius: 12 }} />
              <IonSkeletonText animated style={{ width: 36, height: 36, borderRadius: 12 }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

