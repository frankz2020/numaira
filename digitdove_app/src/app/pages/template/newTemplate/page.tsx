"use client";
import { useFormat } from "@/app/providers/FormatContext";
import { useTheme } from "@/app/providers/ThemeContext";
import React, { useEffect, useState } from "react";
import Spreadsheet, { CellBase, Matrix } from "react-spreadsheet";
import DocumentEditor, {
  BaseBlockProps,
  EditorItemTypes,
  TextBlockProps,
} from "./documentEditor";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragStartEvent,
  useSensors,
} from "@dnd-kit/core";
import { MouseSensor } from "./DndSensors";
import { arrayMove } from "@dnd-kit/sortable";
import DraggableButton, { ElementType } from "./draggableButton";
import SideModuleMenu from "./sideModuleMenu";

interface Cell extends CellBase {
  value: string | number | boolean | null;
}

const NewTemplate = () => {
  const { theme } = useTheme();
  const { format } = useFormat();

  const [data, setData] = useState<Matrix<Cell>>([
    [{ value: "" }, { value: "" }, { value: "" }],
    [{ value: "" }, { value: "" }, { value: "" }],
    [{ value: "" }, { value: "" }, { value: "" }],
  ]);

  const [activeId, setActiveId] = useState<number | null>(null);
  const [components, setComponents] = useState<BaseBlockProps[]>([]);


  const addRow = () => {
    setData([...data, new Array(data[0].length).fill({ value: "" })]);
  };

  const addColumn = () => {
    setData(data.map((row) => [...row, { value: "" }]));
  };

  const saveData = () => {
    console.log("Saving data:", data);
    // Implement your save functionality here, e.g., sending data to a backend
  };

  useEffect(() => {
    setComponents([
      {
        id: `text-block-${components.length + 1}`,
        text: "Start here :)",
        deltaString: "",
        type: EditorItemTypes.TEXT_BLOCK,
      },
    ]);
  }, []);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as number);
  };

  const sensors = useSensors({
    sensor: MouseSensor,
    options: {},
  });

  return (
    <div
      style={{
        padding: "10px",
        backgroundColor: "#f5f5f5",
        borderRadius: "5px",
      }}
    >
      <>
        {/* <div style={{ marginTop: "20px" }}>
        <button
        className="p-2"
          onClick={addRow}
          style={{
            marginRight: "10px",
            backgroundColor: theme.brand500,
            borderRadius: format.roundmd,
            color: theme.brand
          }}
        >
          Add Row
        </button>
        <button
        className="p-2"
          onClick={addColumn}
          style={{
            marginRight: "10px",
            backgroundColor: theme.brand500,
            borderRadius: format.roundmd,
            color: theme.brand
          }}
        >
          Add Column
        </button>
        <button
        className="p-2"
          onClick={saveData}
          style={{
            backgroundColor: theme.brand500,
            borderRadius: format.roundmd,
            color: theme.brand
          }}
        >
          Save
        </button>
      </div>
      <h2>Excel Editor</h2>
      <Spreadsheet data={data} onChange={setData} /> */}
      </>

      <DndContext
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        sensors={sensors}
      >
        
        {/* <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <DraggableButton type={ElementType.DIVIDER} />
          <DraggableButton type={ElementType.TEXT} />
        </div> */}

        <DocumentEditor
          setComponents={setComponents}
          components={components}
          activeId={activeId}
          setActiveId={setActiveId}
        />
      </DndContext>
    </div>
  );
};

export default NewTemplate;
