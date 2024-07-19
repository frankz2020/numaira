'use client'
import React from "react";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useTheme } from "@/app/providers/ThemeContext";

// Draggable Text Block Componen

interface DraggableDividerProps {
  id: string;
}

const DraggableDivider: React.FC<DraggableDividerProps> = ({
  id,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

    const {theme} = useTheme()
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    paddingLeft: "4px",
    paddingReft: "4px",
    paddingBottom: "10px",
    paddingTop: "10px",
    border: "1px solid gray",
    margin: "4px",
    backgroundColor: "white",
    cursor: "move",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <section>
        <span className="p-2"> <hr style={{color: theme.neutral700, width: '100%'}}/> </span>
      </section>
    </div>
  );
};

export default DraggableDivider;
