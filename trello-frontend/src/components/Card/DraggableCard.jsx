// import { useDraggable } from "@dnd-kit/core";

// export default function DraggableCard({ card, onClick }) {
//   const { attributes, listeners, setNodeRef, transform } = useDraggable({
//     id: card._id,
//     data: {
//       ...card, // 🔥 IMPORTANT
//     },
//   });

//   const style = {
//     transform: transform
//       ? `translate(${transform.x}px, ${transform.y}px)`
//       : undefined,
//   };

//   return (
//     <div
//       ref={setNodeRef}
//       {...listeners}   // ✅ MOVE HERE
//       {...attributes}  // ✅ MOVE HERE
//       style={style}
//       className="bg-[#1f2937] text-white p-2 rounded-lg text-sm hover:bg-[#374151] transition-all flex items-center gap-2 cursor-grab"
//     >
//       {/* Icon */}
//       <div className="text-gray-400">⠿</div>

//       {/* Click */}
//       <div
//         onClick={onClick}
//         className="flex-1 truncate"
//       >
//         {card.title}
//       </div>
//     </div>
//   );
// }

// import { useDraggable } from "@dnd-kit/core";

// export default function DraggableCard({ card, onClick }) {
//   const { attributes, listeners, setNodeRef, transform } = useDraggable({
//     id: card._id,
//     data: { ...card },
//   });

//   const style = {
//     transform: transform
//       ? `translate(${transform.x}px, ${transform.y}px)`
//       : undefined,
//   };

//   return (
//     <div
//       ref={setNodeRef}
//       style={style}
//       className="bg-[#1f2937] text-white p-2 rounded-lg text-sm flex items-center gap-2"
//     >
//       {/* ✅ DRAG HANDLE ONLY */}
//       <div
//         {...listeners}
//         {...attributes}
//         className="cursor-grab text-gray-400"
//       >
//         ⠿
//       </div>

//       {/* ✅ CLICK AREA */}
//       <div
//         onClick={(e) => {
//           e.stopPropagation(); // 🔥 IMPORTANT
//           onClick();
//         }}
//         className="flex-1 cursor-pointer"
//       >
//         {card.title}
//       </div>
//     </div>
//   );
// }

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function DraggableCard({ card, onClick }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: card._id,
    data: {
      ...card,
    },
  });

const style = {
  transform: CSS.Transform.toString(transform),
  transition: "transform 200ms ease",
};

  const formattedDate = card.dueDate ? new Date(card.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : null;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-[#1f2937] text-white p-2 rounded-lg text-sm flex flex-col gap-1"
    >
      {/* LABELS */}
      {card.labels && card.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-1">
          {card.labels.map((lbl, i) => (
            <div key={i} className="w-8 h-2 rounded-full" style={{backgroundColor: lbl}}></div>
          ))}
        </div>
      )}

      <div className="flex items-start gap-2">
        {/* ✅ DRAG HANDLE */}
        <div
          {...listeners}
          {...attributes}
          className="cursor-grab text-gray-400 active:cursor-grabbing mt-0.5"
        >
          ⠿
        </div>

        {/* ✅ CLICK AREA */}
        <div
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          className="flex-1 cursor-pointer leading-tight break-words"
        >
          {card.title}
        </div>
      </div>

      {/* META */}
      {(formattedDate || (card.checklist && card.checklist.length > 0)) && (
        <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
          {formattedDate && (
            <div className="flex items-center gap-1 bg-black/30 px-1.5 py-0.5 rounded">
              🗓 {formattedDate}
            </div>
          )}
          {card.checklist && card.checklist.length > 0 && (
            <div className="flex items-center gap-1">
              ☑ {card.checklist.filter(c => c.completed).length}/{card.checklist.length}
            </div>
          )}
        </div>
      )}
    </div>
  ); 

}

