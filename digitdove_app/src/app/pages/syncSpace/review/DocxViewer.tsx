"use client";
import React, { useEffect, useRef, useState } from "react";
import { parseAsync, renderDocument, WordDocument } from "docx-preview";
import PizZip from "pizzip";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { parseStringPromise, Builder } from "xml2js"; // For XML manipulation
import saveAs from "file-saver";
import { parseInlineStyles, parsePBlockStyles } from "./Util";
import { useTheme } from "@/app/providers/ThemeContext";
import { useFormat } from "@/app/providers/FormatContext";
interface DocxViewerProps {
  file: File | null;
  setFile: (file: File) => void;
  allowEdit?: boolean;
  saveHandle?: (file: File) => void;
}

const DocxViewer: React.FC<DocxViewerProps> = ({
  file,
  allowEdit,
  saveHandle,
}) => {
  const { theme } = useTheme();
  const { format } = useFormat();
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<{
    text: string;
    top: number;
    left: number;
  } | null>(null);
  const [isEditable, setIsEditable] = useState(false); // State to manage contentEditable
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  // Handle the save button click
  const handleSaveClick = async () => {
    if (!file) {
      alert("No file provided");
      return;
    }

    // Convert the file to ArrayBuffer
    const originalDocxArrayBuffer = await file.arrayBuffer();

    // Get the edited HTML content from the contentEditable div
    const editedHtml =
      previewContainerRef.current?.querySelector("article")?.innerHTML || "";

    // Save the changes to the docx file
    saveEditedDocx(originalDocxArrayBuffer, editedHtml);
  };

  // Update the page number based on scroll position
  const handleScroll = () => {
    if (previewContainerRef.current) {
      const container = previewContainerRef.current;
      const currentPage = Math.ceil(
        (container.scrollTop + 1) / container.clientHeight
      );
      setPageNumber(currentPage);
    }
  };

  useEffect(() => {
    if (file && previewContainerRef.current) {
      const reader = new FileReader();
      reader.onload = async function (e) {
        const arrayBuffer = e.target?.result as ArrayBuffer;

        try {
          const wordDocument: WordDocument = await parseAsync(arrayBuffer, {});
          // Traverse the document to find the specific text to highlight
          wordDocument.documentPart.body.children.forEach((child: any) => {
            if (child.type === "paragraph") {
              const paragraph = child;

              paragraph.children.forEach((run: any, index: number) => {
                if (run.type === "run") {
                  run.children.forEach((textNode: any, textIndex: number) => {
                    if (
                      textNode.type === "text" &&
                      textNode.text.includes("accelerate") // Correct the spelling
                    ) {
                      const newRuns = splitTextAndHighlight(
                        run,
                        textNode.text,
                        "accelerate"
                      );
                      paragraph.children.splice(index, 1, ...newRuns);
                    }
                  });
                }
              });
            }
          });

          setTotalPages(wordDocument.extendedPropsPart.props.pages);
          // Render the modified document in the container
          await renderDocument(wordDocument, previewContainerRef.current!);

          if (previewContainerRef.current) {
            previewContainerRef.current.addEventListener("scroll", handleScroll);
          
            if (previewContainerRef.current && allowEdit) {
              setIsEditable(true);
          
              const articleElement = previewContainerRef.current.querySelector("article");
          
              if (articleElement) {
                // Make the article content editable
                articleElement.setAttribute("contentEditable", "true");
          
                // Apply base styles to prevent shifting and enable smooth transitions
                articleElement.style.boxSizing = "border-box"; // Prevent padding from affecting layout
                articleElement.style.transition = "outline 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease"; // Add smooth transition for focus effects
          
                // Add the focus event listener
                articleElement.addEventListener("focus", () => {
                  articleElement.style.outline = "2px solid " + theme.brand500; // Custom outline for focus
                  articleElement.style.padding = "10px"; // Add some padding for visual clarity
                  articleElement.style.borderRadius = "5px"; // Optional: rounded corners
                  articleElement.style.boxShadow = "0 0 10px rgba(0, 150, 255, 0.8)"; // Apply a glow effect
                  articleElement.style.transform = "scale(1.01)"; // Slight scaling on focus
                });
          
                // Remove styles on blur (when focus is lost)
                articleElement.addEventListener("blur", () => {
                  articleElement.style.outline = "none"; // Remove outline
                  articleElement.style.boxShadow = "none"; // Remove glow effect
                  articleElement.style.transform = "scale(1)"; // Reset scale
                });
          
                // Focus the contentEditable div so the user can start editing
                articleElement.focus();
              }
            }
          }
          

          // After rendering, look for highlighted text and add hover events
          attachHoverEventsForHighlightedText();

          changeDoxWrapperStyle();
        } catch (error) {
          console.error("Error rendering document:", error);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  }, [file]);

  const changeDoxWrapperStyle = () => {
    const container = previewContainerRef.current;
    if (!container) return;
    const docWrapper = container.querySelector(".docx-wrapper") as HTMLElement;
    if (docWrapper) {
      docWrapper.style.background = theme.neutral50;
    }
  };

  // Helper function to split text and create new runs
  const splitTextAndHighlight = (
    originalRun: any,
    text: string,
    highlight: string
  ) => {
    const highlightStart = text.indexOf(highlight);
    const highlightEnd = highlightStart + highlight.length;

    // Text before the highlighted word
    const beforeText = text.substring(0, highlightStart);
    // The highlighted word itself
    const highlightedText = text.substring(highlightStart, highlightEnd);
    // Text after the highlighted word
    const afterText = text.substring(highlightEnd);

    const newRuns = [];

    // Create a new run for the text before the highlighted word
    if (beforeText) {
      const beforeRun = {
        ...originalRun,
        children: [{ ...originalRun.children[0], text: beforeText }],
      };
      newRuns.push(beforeRun);
    }

    // Create a new run for the highlighted word with a different style
    const highlightRun = {
      ...originalRun,
      children: [{ ...originalRun.children[0], text: highlightedText }],
      cssStyle: {
        ...originalRun.cssStyle,
        backgroundColor: "yellow",
        cursor: "pointer",
      }, // Apply the highlight style
    };
    newRuns.push(highlightRun);

    // Create a new run for the text after the highlighted word
    if (afterText) {
      const afterRun = {
        ...originalRun,
        children: [{ ...originalRun.children[0], text: afterText }],
      };
      newRuns.push(afterRun);
    }

    return newRuns;
  };

  const attachHoverEventsForHighlightedText = () => {
    const container = previewContainerRef.current;

    if (!container) return;

    // Find all elements with background-color: yellow
    const highlightedElements = container.querySelectorAll(
      "span[style*='background-color: yellow']"
    );

    highlightedElements.forEach((element) => {
      // Mouse over for tooltip
      element.addEventListener("mouseover", (event) => {
        const target = event.currentTarget as HTMLElement;
        const rect = target.getBoundingClientRect();
        setTooltip({
          text: "This is highlighted text",
          top: rect.top + window.scrollY - 30, // Position above the element
          left: rect.left + window.scrollX + rect.width / 2, // Center horizontally
        });
      });

      // Mouse out to hide tooltip
      element.addEventListener("mouseout", () => {
        setTooltip(null); // Hide tooltip when not hovering
      });

      // Click event to enable contentEditable
      element.addEventListener("click", () => {
        if (previewContainerRef.current) {
          setIsEditable(true);
          previewContainerRef.current
            .querySelector("article")
            ?.setAttribute("contentEditable", "true");
          previewContainerRef.current.focus(); // Focus the div so the user can start editing
        }
      });
    });
  };

  const htmlToDocxDocument = (html: string): Document => {
    const parser = new DOMParser();
    const docHtml = parser.parseFromString(html, "text/html");

    const paragraphs: Paragraph[] = [];

    // Loop through all <p> elements (paragraphs)
    docHtml.body.querySelectorAll("p").forEach((paragraphNode) => {
      const runs: TextRun[] = [];
      const blockStyles = parsePBlockStyles(
        paragraphNode.getAttribute("style") || ""
      );
      // Loop through child nodes in each <p> (text and <span> elements)
      paragraphNode.childNodes.forEach((childNode) => {
        if (childNode.nodeType === Node.TEXT_NODE) {
          runs.push(new TextRun(childNode.textContent || ""));
        } else if (childNode.nodeName === "SPAN") {
          const spanElement = childNode as HTMLElement;
          const styles = parseInlineStyles(
            spanElement.getAttribute("style") || ""
          );

          // Create a new run with text and styles
          runs.push(
            new TextRun({
              text: spanElement.textContent || "",
              bold: styles["bold"] || false,
              italics: styles["italics"] || false,
              underline: styles["underline"] || false,
              font: styles["font"] || "Times New Roman",
              size: styles["size"] || 22, // Default size 11pt in docx (22 half-points)
              highlight: styles["highlight"] || undefined,
              color: styles["color"] || undefined,
            })
          );
        }
      });

      // Add the runs to the paragraph
      paragraphs.push(new Paragraph({ children: runs, ...blockStyles }));
    });

    const doc = new Document({
      sections: [{ children: paragraphs }],
    });

    return doc;
  };

  const saveEditedDocx = async (
    originalDocx: ArrayBuffer,
    editedHtml: string
  ) => {
    // Step 1: Parse the edited HTML to create a new docx.Document
    const newDoc = htmlToDocxDocument(editedHtml);

    // Step 2: Extract the <w:body> from the new docx document
    const newBodyXml = await getBodyXmlFromDocx(newDoc);

    // console.log("newBodyXml", newBodyXml);
    // Step 3: Replace the <w:body> in the original docx with the new one
    await replaceBodyInOriginalDocx(originalDocx, newBodyXml);
  };

  const getBodyXmlFromDocx = async (doc: Document) => {
    // Use Packer to generate the new docx document as a binary buffer
    const buffer = await Packer.toBuffer(doc);

    // Use PizZip to unzip the generated docx file
    const zip = new PizZip(buffer);
    const documentXml = zip.file("word/document.xml")?.asText();

    if (!documentXml) {
      throw new Error("Could not find document.xml in the new docx document.");
    }

    // Parse the XML and extract the <w:body>
    const parsedXml = await parseStringPromise(documentXml);
    return parsedXml["w:document"]["w:body"];
  };

  const replaceBodyInOriginalDocx = async (
    originalDocx: ArrayBuffer,
    newBodyXml: any
  ) => {
    // Load the original .docx using PizZip
    const zip = new PizZip(originalDocx);

    // Get the original "word/document.xml"
    const documentXml = zip.file("word/document.xml")?.asText();
    if (!documentXml) {
      throw new Error("Could not find document.xml in the original docx file.");
    }

    // Parse the original document.xml
    const xmlObj = await parseStringPromise(documentXml);

    // Replace the original <w:body> with the new one
    xmlObj["w:document"]["w:body"] = newBodyXml;

    // Build the updated XML
    const builder = new Builder();
    const updatedDocumentXml = builder.buildObject(xmlObj);

    // Replace the old "word/document.xml" with the updated XML in the zip
    zip.file("word/document.xml", updatedDocumentXml);

    // Repackage the .docx file
    const updatedDocxContent = zip.generate({ type: "blob" });
    saveAs(updatedDocxContent, "updated-document.docx");
  };

  return (
    <div className="relative">
      <div
        style={{
          position: "sticky", // Changed from 'absolute' to 'sticky'
          top: "8%", // Sticks to the top
          marginLeft: "1%",
          zIndex: 1001,
        }}
        className="flex justify-start"
      >
        <div
          style={{
            backgroundColor: theme.neutral,
            padding: "5px 10px",
            borderRadius: "5px",
          }}
        >
          {pageNumber} / {totalPages}
        </div>
      </div>
      {/* Main document preview container */}
      <div
        ref={previewContainerRef}
        style={{
          minHeight: "100%", // Fill most of the vertical space
          maxHeight: "100%", // Maximize the height
          overflowY: "scroll", // Make the viewer scrollable
          backgroundColor: theme.neutral50, // Set the background to white
          border: "1px solid " + theme.neutral50,
          position: "relative",
          width: "100%", // Full width
          margin: "10px auto", // Center the viewer horizontally
          padding: "10px", // Add some padding to the content
        }}
      />

      {/* Tooltip for hover */}
      {tooltip && (
        <div
          style={{
            position: "absolute",
            top: tooltip.top,
            left: tooltip.left,
            transform: "translateX(-50%)",
            backgroundColor: "black",
            color: "white",
            padding: "5px 10px",
            borderRadius: "5px",
            pointerEvents: "none", // Prevent blocking mouse events
            whiteSpace: "nowrap",
            zIndex: 1000,
          }}
        >
          {tooltip.text}
        </div>
      )}

      {/* Display a message when content is editable */}
      {isEditable && (
        <div
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            backgroundColor: "#ffeb3b",
            padding: "5px 10px",
            borderRadius: "5px",
            zIndex: 1001,
          }}
        >
          Editing Mode
        </div>
      )}

      {/* Save button */}
      <div
        className="bg-blue500"
        onClick={handleSaveClick}
        style={{
          cursor: "pointer",
          padding: "10px",
          color: "white",
          backgroundColor: "blue",
          marginTop: "10px",
        }}
      >
        Save the changes to the DOCX file
      </div>
    </div>
  );
};

export default DocxViewer;
