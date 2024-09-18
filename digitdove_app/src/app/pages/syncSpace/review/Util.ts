



export const parseInlineStyles = (styleString: string) => {
    const styles: { [key: string]: any } = {}; // Provide a type for the styles object
    const styleArray = styleString.split(";").filter(Boolean);
    styleArray.forEach(style => {
      const [key, value] = style.split(":").map(s => s.trim());
      switch (key) {
        case "font-weight":
          if (value === "bold") {
            styles["bold"] = true;
          }
          break;
        case "font-style":
          if (value === "italic") {
            styles["italics"] = true;
          }
          break;
        case "text-decoration":
          if (value === "underline") {
            styles["underline"] = {};
          }
          break;
        case "font-size":
          styles["size"] = parseFloat(value) * 2; // DOCX uses half-point sizes
          break;
        case "font-family":
          styles["font"] = value.replace(/['"]+/g, ''); // Remove quotes around font family
          break;
        case "background-color":
          styles["highlight"] = value; // docx has limited highlight support
          break;
        case "color":
          styles["color"] = value;
          break;
      }
    });
    return styles;
  };

  // parse block-level styles for elements like <p>, <div>, <h1>, etc.
  export const parsePBlockStyles = (styleString: string) => {
    const styles: { [key: string]: any } = {}; // Provide a type for the styles object
    const styleArray = styleString.split(";").filter(Boolean);
  
    styleArray.forEach(style => {
      const [key, value] = style.split(":").map(s => s.trim());
      switch (key) {
        case "margin-bottom":
          // DOCX uses "spacing" for paragraph spacing (in 1/20th of a point units)
          styles["spacing"] = { after: parseFloat(value) * 20 }; // Convert to DOCX units
          break;
        case "line-height":
          // DOCX uses "line" for line spacing (in 240ths of a point)
          styles["lineSpacing"] = parseFloat(value) * 240; // Convert to DOCX units
          break;
        case "text-align":
          // DOCX alignment: left, right, center, justify
          styles["alignment"] = value;
          break;
        // You can add more cases for other common styles like padding, etc.
        default:
          break;
      }
    });
  
    return styles;
  };

  /**
 * Parse block-level styles for elements like <p>, <div>, <h1>, etc.
 */
export const parseBlockStyles = (element: HTMLElement) => {
    const styles: { [key: string]: any } = {};
    const styleString = element.getAttribute("style") || "";
  
    if (styleString.includes("text-align")) {
      const match = styleString.match(/text-align:\s*(\w+)/);
      if (match) {
        styles["alignment"] = match[1];
      }
    }
  
    return styles;
  };