import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  useSensors,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";

import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import DraggableTextBlock from "./draggableText";
import { MouseSensor, SmartPointerSensor } from "./DndSensors";
import DragPlaceholder from "../../../assets/placeholder/dragPlaceholder.png";
import { useTheme } from "@/app/providers/ThemeContext";
import TemplateType from "../templateType";
import { useGlobalContext } from "@/app/providers/GlobalContext";
import draggableDivider from "./draggableDivider";
import DraggableDivider from "./draggableDivider";
export enum EditorItemTypes {
  TEXT_BLOCK,
  DIVIDER,
};

// Define TypeScript types for the components
interface TextBlockProps extends BaseBlockProps{
  text: string;
  deltaString: string;

}

interface BaseBlockProps {
  id: string;
  type: EditorItemTypes;
  [key: string]: any;
}

interface DocumentEditorProps {}

// Document Editor Component
const DocumentEditor: React.FC<DocumentEditorProps> = () => {
  const { theme } = useTheme();
  const [components, setComponents] = useState<BaseBlockProps[]>([]);
  const [title, setTitle] = useState<string>("Document Title");
  const [activeId, setActiveId] = useState<number | null>(null);

  const { backendUrl } = useGlobalContext();
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setComponents((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);
        setActiveId(null);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as number);
  };

  const addTextBlock = () => {
    const newTextBlock: TextBlockProps = {
      id: `text-block-${components.length + 1}`,
      text: "New Text Block",
      deltaString: "",
      type: EditorItemTypes.TEXT_BLOCK,
    };
    setComponents((prevComponents) => [...prevComponents, newTextBlock]);
  };

  const addDivider = () => {
    const newDivier: BaseBlockProps = {
      id: `divider-block-${components.length + 1}`,
      type: EditorItemTypes.DIVIDER,
    };
    setComponents((prevComponents) => [...prevComponents, newDivier]);
  };


  const handleTextChange = (
    id: string,
    newText: string,
    deltaString: string
  ) => {
    setComponents((prevComponents) =>
      prevComponents.map((component) =>
        component.id === id
          ? { ...component, text: newText, deltaString: deltaString }
          : component
      )
    );
  };

  const handleSaveTemplate = () => {
    const lastEdited = new Date().toLocaleString();
    const name = title;
    const paragraphs = components.map((component) => {
      if (component.type == EditorItemTypes.TEXT_BLOCK) {
        return component.deltaString;
      } else if (component.type ==  EditorItemTypes.DIVIDER){
        return 'divider'
      }
    });

    if (paragraphs.length < 1) {
      console.log("invalid document");
      return;
    }

    console.log("saving: ", name, paragraphs, lastEdited);

    fetch(`${backendUrl}/template/createTemplate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        name: name,
        last_edited: lastEdited,
        paragraphs: paragraphs,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const sensors = useSensors({
    sensor: MouseSensor,
    options: {},
  });

  return (
    <div style={{ padding: "16px" }}>
      <div className="flex justify-between ">
        <button
          onClick={addTextBlock}
          className="cursor-pointer px-3 py-2 rounded"
          style={{
            marginBottom: "16px",
            cursor: "pointer",
            backgroundColor: theme.brand500,
            color: theme.neutral,
          }}
        >
          Add Text Block
        </button>

        <button
          onClick={addDivider}
          className="cursor-pointer px-3 py-2 rounded"
          style={{
            marginBottom: "16px",
            cursor: "pointer",
            backgroundColor: theme.brand800,
            color: theme.neutral,
          }}
        >
          Add Divier
        </button>

        <button
          className="cursor-pointer px-3 py-2 rounded"
          style={{
            marginBottom: "16px",
            cursor: "pointer",
            backgroundColor: theme.brand500,
            color: theme.neutral,
          }}
          onClick={handleSaveTemplate}
        >
          Save Template
        </button>
      </div>

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
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        sensors={sensors}
      >
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
              <>
                {activeId != Number(component.id) && component.type == EditorItemTypes.TEXT_BLOCK &&(
                  <DraggableTextBlock
                    key={component.id }
                    id={component.id}
                    text={component.text}
                    onTextChange={handleTextChange}
                  />
                )} 
                {
                  component.type == EditorItemTypes.DIVIDER && (
                    <>
                    <DraggableDivider id={component.id} />
                    </>
                  )
                }
              </>
            ))}
          </div>
        </SortableContext>
        <DragOverlay>
          <img
            src={DragPlaceholder.src}
            alt="placeholder"
            style={{ width: "50px", height: "50px" }}
          />
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default DocumentEditor;
