"use client";
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
import { draggableStyle } from "./draggbleCommons";

// Draggable Text Block Componen

interface DraggableDividerProps {
  id: string;
}

const DraggableDivider: React.FC<DraggableDividerProps> = ({ id }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const [isHovered, setIsHovered] = React.useState(false);
  const { theme } = useTheme();
  const style = {
    transform: CSS.Transform.toString(transform),
    ...draggableStyle,
    boxShadow: isHovered ? "0px 4px 8px rgba(0, 0, 0, 0.1)" : "none",
    marginTop: isHovered ? "4px" : "0px",
    marginBottom: isHovered ? "4px" : "0px",
    borderRadius: isHovered ? "4px" : "0px",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onMouseOver={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <section>
        <span className="p-2">
          {" "}
          <hr style={{ color: theme.neutral700, width: "100%" }} />{" "}
        </span>
      </section>
    </div>
  );
};

export default DraggableDivider;
