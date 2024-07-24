import React, { useRef } from "react";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { draggableStyle } from "./draggbleCommons";
import { arrayMove, SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { EditorItemTypes } from "./documentEditor";
import { useTheme } from "@/app/providers/ThemeContext";

// Draggable Text Block Componen

interface DraggableTextBlockProps {
  id: string;
  text: string;
  onTextChange: (id: string, newText: string, deltaString: string) => void;
  setActiveEditor: (editor: ReactQuill) => void;
  activeEditor: ReactQuill;
}

const DraggableTextBlock: React.FC<DraggableTextBlockProps> = ({
  id,
  text,
  onTextChange,
  setActiveEditor,
  activeEditor,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const editorRef = useRef<ReactQuill | null>(null);
  const { theme } = useTheme();
  const [isSelected, setIsSelected] = React.useState(false);
  const style = {
    transform: CSS.Transform.toString(transform),
    ...draggableStyle,
    boxShadow: isSelected ? "0px 4px 8px rgba(0, 0, 0, 0.1)" : "none",
    marginTop: isSelected ? "4px" : "0px",
    marginBottom: isSelected ? "4px" : "0px",
    borderRadius:
      isSelected || activeEditor === editorRef.current ? "4px" : "0px",
    border:
      activeEditor === editorRef.current
        ? "2px solid blue"
        : "2px solid transparent",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onMouseOver={() => setIsSelected(true)}
      onMouseOut={() => setIsSelected(false)}
      
    >
      <section data-no-dnd="true" onClick={() =>  setActiveEditor(editorRef.current!)}>
        <ReactQuill
          ref={editorRef}
          value={text}
          theme="snow"
          onChange={(content, delta, source, editor) => {
            onTextChange(id, content, JSON.stringify(editor.getContents()));
           
          }}
          //   onChange={(newText) => onTextChange(id, newText)}
          modules={{
            toolbar: false,
            // toolbar: [
            //   [{ header: "1" }, { header: "2" }, { font: [] }],
            //   [{ size: [] }],
            //   ["bold", "italic", "underline", "strike", "blockquote"],
            //   [
            //     { list: "ordered" },
            //     { list: "bullet" },
            //     { indent: "-1" },
            //     { indent: "+1" },
            //   ],
            //   ["link", "image"],
            //   ["clean"],
            // ],
          }}
          style={{
            width: "100%",
          }}
        />
      </section>
    </div>
  );
};

export default DraggableTextBlock;
