import React, { useEffect, useRef, useState } from "react";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { renderAsync } from "docx-preview";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import mammoth from "mammoth";

interface EditDocxProps {
  targetFile: File | null;
  back: () => void;
  docContent: ArrayBuffer | null;
  setDocContent: (docContent: ArrayBuffer | null) => void;
  setQuillContent: (quillContent: string) => void;
  quillContent: string;
}

const EditDocx: React.FC<EditDocxProps> = ({
  targetFile,
  back,
  docContent,
  setDocContent,
  setQuillContent,
  quillContent,
}) => {
  const previewContainerRef = useRef<HTMLDivElement>(null);

  // Extract content from DOCX file when uploaded
  useEffect(() => {
    if (targetFile) {
      const reader = new FileReader();
      reader.onload = async function (e) {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        setDocContent(arrayBuffer);
        try {
          const result = await mammoth.convertToHtml({ arrayBuffer });
          setQuillContent(result.value); // Set extracted content to Quill
        } catch (error) {
          console.error("Error processing DOCX file:", error);
        }
      };
      reader.readAsArrayBuffer(targetFile);
    }
  }, [targetFile, setDocContent, setQuillContent]);

  // Handle React Quill content change
  const handleQuillChange = (content: string) => {
    setQuillContent(content);
  };

  // Save updated content back to docContent and re-render preview
  const saveUpdatedDocx = async () => {

    if (!docContent) return;
    console.log("Saving updated DOCX...");

    // Use PizZip and Docxtemplater to load the original document
    const zip = new PizZip(docContent);
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    // Replace the body content with the updated Quill content
    // This assumes a template structure that allows content replacement
    doc.setData({ body: quillContent });

    // Generate updated content as ArrayBuffer
    const updatedArrayBuffer = doc.getZip().generate({ type: "arraybuffer" });
    console.log(updatedArrayBuffer)
    setDocContent(updatedArrayBuffer); // Update docContent state

    // Re-render the updated content in the preview
    if (previewContainerRef.current) {
      await renderAsync(updatedArrayBuffer, previewContainerRef.current);
    }
  };

  return (
    <div>
      <h3>Edit DOCX with React Quill</h3>
      <div onClick={back}>Back to Preview</div>
      {/* Save Button */}
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => {
          console.log("test");
          saveUpdatedDocx();
        }}
      >
        Apply Changes
      </button>

      {/* Quill Editor */}
      <ReactQuill
        theme="snow"
        value={quillContent}
        onChange={handleQuillChange}
        style={{ height: "400px", marginBottom: "20px" }}
      />
    </div>
  );
};

export default EditDocx;
