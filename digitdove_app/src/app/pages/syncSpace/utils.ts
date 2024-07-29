import mammoth from "mammoth";

export const readDocxFile = async (file: File) => {
    const arrayBuffer = await file.arrayBuffer();
    const { value: html, messages } = await mammoth.convertToHtml({
      arrayBuffer,
    });
    const { value: text } = await mammoth.extractRawText({ arrayBuffer });
    return { text, html, arrayBuffer };
  };