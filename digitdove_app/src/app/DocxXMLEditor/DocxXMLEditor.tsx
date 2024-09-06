import React, { useEffect, useState, useRef } from "react";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import saveAs from "file-saver";

interface DocxXMLEditorProps {
  targetFile: File | null;
  setTargetFile: (targetFile: File) => void;
}

const DocxXMLEditor: React.FC<DocxXMLEditorProps> = ({
  targetFile,
  setTargetFile,
}) => {
  const [docxContent, setDocxContent] = useState<ArrayBuffer | null>(null);
  const [xmlContent, setXmlContent] = useState<string>("");
  const [paragraphs, setParagraphs] = useState<string[]>([]);
  const [updatedContent, setUpdatedContent] = useState<string[]>([]);
  const [selectedParagraph, setSelectedParagraph] = useState<number | null>(
    null
  );
  const paragraphRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (targetFile) {
      const reader = new FileReader();
      reader.onload = async function (e) {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        if (arrayBuffer) {
          setDocxContent(arrayBuffer);
          loadDocx(arrayBuffer);
        }
      };
      reader.readAsArrayBuffer(targetFile);
    }
  }, [targetFile]);

  const loadDocx = (content: ArrayBuffer) => {
    const zip = new PizZip(content);
    const xml = zip.files["word/document.xml"].asText();
    setXmlContent(xml);
    setParagraphs(convertParagraphs(xml));
  };

  const convertParagraphs = (xml: string): string[] => {
    const xmlParser = new DOMParser();
    const xmlDoc = xmlParser.parseFromString(xml, "application/xml");

    const textElements = xmlDoc.getElementsByTagName("w:t");
    const paragraphArray: string[] = [];
    const initialContent: string[] = [];

    for (let i = 0; i < textElements.length; i++) {
      const textElement = textElements[i];
      const text = textElement.textContent || "";
      paragraphArray.push(text);
      initialContent.push(text); // Initialize updatedContent with existing content
    }

    setUpdatedContent(initialContent); // Initialize state here
    return paragraphArray;
};

  
  const generateUpdatedDocx = (): void => {

    // update xml content
    const xmlParser = new DOMParser();
    const xmlDoc = xmlParser.parseFromString(xmlContent, "application/xml");

    const textElements = xmlDoc.getElementsByTagName("w:t");

    updatedContent.forEach((newContent, index) => {
      if (textElements[index]) {
        textElements[index].textContent = newContent;
      }
    });

    const xmlSerializer = new XMLSerializer();
    const updatedXml = xmlSerializer.serializeToString(xmlDoc);
    console.log("Updated XML:", updatedXml);
    setXmlContent(updatedXml);

    // generate docx
    const zip = new PizZip(docxContent!);
    zip.file("word/document.xml", updatedXml);


    const updatedArrayBuffer = zip.generate({ type: "arraybuffer" });
    setDocxContent(updatedArrayBuffer);

    const blob = new Blob([updatedArrayBuffer], { type: targetFile!.type });
    const updatedFile = new File([blob], targetFile!.name, {
      type: targetFile!.type,
    });
    setTargetFile(updatedFile);
    console.log("Updated DOCX generated, new xml:" + updatedXml);
    // Trigger download immediately after updating the content
    // downloadBlobAsDocx(updatedArrayBuffer);
  };


  const handleParagraphChange = (index: number) => {
    const paragraphText = paragraphRefs.current[index]?.innerText || "";
    const updatedContentArray = [...updatedContent];

    // Ensure the entire array is correctly populated
    updatedContentArray[index] = paragraphText;
    setUpdatedContent(updatedContentArray);
};
  const downloadUpdatedDocx = () => {
    if (!docxContent) return;
    const updatedBlob = new Blob([docxContent], {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });
    saveAs(updatedBlob, "updated_document.docx");
  };

  return (
    <div>
      <h3>Docx XML Editor</h3>
      <div
        className="flex-col"
        style={{
          padding: "20px",
          backgroundColor: "#f4f4f4",
          borderRadius: "10px",
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        {paragraphs.map((content, index) =>
          content.length > 0 ? (
            <div
              key={index}
              ref={(el) => {
                paragraphRefs.current[index] = el;
              }}
              contentEditable={true}
              suppressContentEditableWarning={true}
              className={`w-full mb-4 p-3 ${
                updatedContent[index]
                  ? "border-b-4 border-blue-500"
                  : "border-b-2 border-transparent"
              }`}
              style={{
                backgroundColor: "#fff",
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                borderRadius: "4px",
                overflow: "hidden",
                resize: "none",
                whiteSpace: "pre-wrap",
              }}
              onInput={() => handleParagraphChange(index)}
            >
              {content}
            </div>
          ) : null
        )}
      </div>

      <button
        onClick={() => generateUpdatedDocx()}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Save Changes to DOCX
      </button>
      <button
        onClick={downloadUpdatedDocx}
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
      >
        Export as DOCX
      </button>
      <pre>{xmlContent}</pre>
    </div>
  );
};

export default DocxXMLEditor;
