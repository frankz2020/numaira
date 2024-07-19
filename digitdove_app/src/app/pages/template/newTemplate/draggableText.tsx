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
      <section data-no-dnd="true">
        <ReactQuill
          value={text}
          onChange={(content, delta, source, editor) => onTextChange(id, content, JSON.stringify(editor.getContents()))}
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
