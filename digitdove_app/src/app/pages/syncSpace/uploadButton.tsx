import { useFormat } from "@/app/providers/FormatContext";
import { useTheme } from "@/app/providers/ThemeContext";
import { useState } from "react";
import UploadSVG from "@/app/assets/upload.svg";
type UploadButtonProps = {
    onClick: (file: File) => void;
    fileType: string[] | null;
  };
  const UploadButton = (props: UploadButtonProps) => {
    const { onClick, fileType } = props;
    const { theme } = useTheme();
    const { format } = useFormat();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        setSelectedFile(file);
        onClick(file);
      }
    };
    return (
      <div
        className="p-5"
        style={{
          backgroundColor: theme.neutral,
          border: "2px solid " + theme.brand500,
          borderBottomLeftRadius: format.roundmd,
          borderBottomRightRadius: format.roundmd,
        }}
      >
        <div
          className="p-3 items-center flex flex-col justify-center "
          style={{
            border: "2px dotted " + theme.neutral1000,
            width: "100%",
            borderRadius: format.roundmd,
          }}
        >
          <UploadSVG />
          <div style={{ fontWeight: 700 }}>Drop Files here</div>
          <div style={{ color: theme.neutral700, fontSize: format.textSM }}>
            DOCX Format up to 10MB
          </div>
          <input
            type="file"
            id="fileInput"
            accept={fileType?.toString() ?? ""}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <button
            className="py-2 px-3 m-2"
            onClick={() => document.getElementById("fileInput")?.click()}
            style={{
              backgroundColor: theme.brand500,
              color: theme.neutral,
              borderRadius: format.roundmd,
            }}
          >
            Select File
          </button>
        </div>
      </div>
    );
  };

  export default UploadButton;