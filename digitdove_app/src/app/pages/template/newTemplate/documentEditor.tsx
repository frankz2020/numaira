import React, { useState } from "react";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const ItemTypes = {
  TEXT_BLOCK: "TEXT_BLOCK",
};

// Define TypeScript types for the components
interface TextBlockProps {
  id: string;
  text: string;
}

interface DraggableTextBlockProps {
  id: string;
  text: string;
  onTextChange: (id: string, newText: string) => void;
}

interface DocumentEditorProps {}

// Draggable Text Block Component
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
      padding: "8px",
      border: "1px solid gray",
      margin: "4px",
      backgroundColor: "white",
      cursor: "move",
    };
  
    return (
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        <textarea
          value={text}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          onChange={(e) => onTextChange(id, e.target.value)}
          style={{
            width: "100%",
            height: "100%",
            resize: "none",
            border: "none",
            outline: "none",
            borderRadius: "4px",
          }}
        />
      </div>
    );
  };
  

// Document Editor Component
const DocumentEditor: React.FC<DocumentEditorProps> = () => {
  const [components, setComponents] = useState<TextBlockProps[]>([]);
  const [title, setTitle] = useState<string>("Document Title");

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setComponents((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const addTextBlock = () => {
    const newTextBlock: TextBlockProps = {
      id: `text-block-${components.length + 1}`,
      text: "New Text Block",
    };
    setComponents((prevComponents) => [...prevComponents, newTextBlock]);
  };

  const handleTextChange = (id: string, newText: string) => {
    setComponents((prevComponents) =>
      prevComponents.map((component) =>
        component.id === id ? { ...component, text: newText } : component
      )
    );
  };

  return (
    <div style={{ padding: "16px" }}>
      <button
        onClick={addTextBlock}
        style={{ marginBottom: "16px", padding: "8px 16px", cursor: "pointer" }}
      >
        Add Text Block
      </button>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{
          fontSize: "24px",
          marginBottom: "16px",
          padding: "8px",
          width: "100%",
          boxSizing: "border-box",
        }}
      />
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={components}
          strategy={verticalListSortingStrategy}
        >
          <div
            style={{
              minHeight: "400px",
              border: "2px dashed gray",
              padding: "16px",
            }}
          >
            {components.map((component) => (
              <DraggableTextBlock
                key={component.id}
                id={component.id}
                text={component.text}
                onTextChange={handleTextChange}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default DocumentEditor;
