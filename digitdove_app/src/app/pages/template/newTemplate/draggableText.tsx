import React from "react";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { draggableStyle } from "./draggbleCommons";
import { arrayMove, SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { EditorItemTypes } from "./documentEditor";

// Draggable Text Block Componen

interface DraggableTextBlockProps {
  id: string;
  text: string;
  onTextChange: (id: string, newText: string, deltaString: string) => void;
}

const DraggableTextBlock: React.FC<DraggableTextBlockProps> = ({
  id,
  text,
  onTextChange,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const [isHovered, setIsHovered] = React.useState(false);
  const style = {
    transform: CSS.Transform.toString(transform),
    ...draggableStyle,
    boxShadow: isHovered ? "0px 4px 8px rgba(0, 0, 0, 0.1)" : "none",
    marginTop: isHovered ? "4px" : "0px",
    marginBottom: isHovered ? "4px" : "0px",
    borderRadius: isHovered? "4px": "0px"
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
      <section data-no-dnd="true">
        <ReactQuill
          value={text}
          onChange={(content, delta, source, editor) =>
            onTextChange(id, content, JSON.stringify(editor.getContents()))
          }
          //   onChange={(newText) => onTextChange(id, newText)}
          modules={{
            toolbar: [
              [{ header: "1" }, { header: "2" }, { font: [] }],
              [{ size: [] }],
              ["bold", "italic", "underline", "strike", "blockquote"],
              [
                { list: "ordered" },
                { list: "bullet" },
                { indent: "-1" },
                { indent: "+1" },
              ],
              ["link", "image"],
              ["clean"],
            ],
          }}
          style={{ width: "100%" }}
        />
      </section>
    </div>
  );
};

export default DraggableTextBlock;
