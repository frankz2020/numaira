"use client";
import React, { useEffect, useState } from "react";
import PizZip from "pizzip";
import { saveAs } from "file-saver";
import DocxViewer from "./DocxViewer"; // Import the new DocxViewer component
import DocxXMLEditor from "@/app/DocxXMLEditor/DocxXMLEditor";
import { useGlobalContext } from "@/app/providers/GlobalContext";

const ReviewDifference = () => {
  const { syncSpaceTargetFile, setSyncSpaceTargetFile } = useGlobalContext();
  const [docContent, setDocContent] = useState<ArrayBuffer | null>(null);
  const [preview, setPreview] = useState<boolean>(false);

  useEffect(() => {
    if (syncSpaceTargetFile) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        setDocContent(arrayBuffer);
      };
      reader.readAsArrayBuffer(syncSpaceTargetFile);
    }
  }, [syncSpaceTargetFile]);

  const downloadUpdatedDocx = () => {
    if (!docContent) return;
    const updatedBlob = new Blob([docContent], {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });
    saveAs(updatedBlob, "updated_document.docx");
  };

  return (
    <div className="flex flex-col w-full h-full overflow-scroll">
      {/* <button
        onClick={() => setPreview(!preview)}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Change view
      </button> */}

      <DocxViewer file={syncSpaceTargetFile} setFile={setSyncSpaceTargetFile}/>
      <button
        onClick={downloadUpdatedDocx}
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
      >
        Export as DOCX
      </button>
    </div>
  );
};

export default ReviewDifference;
