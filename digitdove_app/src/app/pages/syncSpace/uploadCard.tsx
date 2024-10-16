"use client";
import { useFormat } from "@/app/providers/FormatContext";
import { useTheme } from "@/app/providers/ThemeContext";
import { ReactNode, useState } from "react";
import UploadSVG from "./asset/upload.svg";
import UpdataSVG from "./asset/updata.svg";
type UploadCardProps = {
  functional?: boolean; // turn on for it to be able to upload files, turn off for other functionality
  name: string;
  svgType: string;
  onClick?: (file: File) => void;
  noneUploadClick?: () => void;
  fileType: string[] | null;
};

/**
 * UploadCard component represents a card used for uploading files.
 * you can make it a basic card by setting the functional prop to false
 * @component
 * @example
 * ```tsx
 * <UploadCard
 *   onClick={(file) => console.log(file)}
 *   fileType=".jpg, .png"
 *   functional={true}
 *   svgType="target"
 *   name="Upload Image"
 * />
 * ```
 */

const UploadCard = (props: UploadCardProps) => {
  const { onClick, fileType } = props;
  const { theme } = useTheme();
  const { format } = useFormat();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      onClick?.(file); // Trigger the callback with the selected file
    }
  };

  return (
    <div
      onClick={() => {
        if (props.functional == null || props.functional == true) {
          document.getElementById("fileInput")?.click();
        } else if (props.noneUploadClick) {
          props.noneUploadClick();
        }
      }}
      style={{
        backgroundColor: theme.brand100,
        borderRadius: format.roundsm,
        borderColor: theme.brand200,
        borderWidth: "2px",
        borderStyle: "dotted",
      }}
      className="flex justify-around py-2 cursor-pointer"
    >
      <div
        style={{
          backgroundColor: theme.neutral,
          borderRadius: format.roundsm,
        }}
        className="p-4"
      >
        {props.svgType == "target" ? <UploadSVG /> : <UpdataSVG />}
      </div>

      <div
        className="items-center flex flex-col justify-center me-2"
        style={{ fontWeight: 600, fontSize: format.textMD }}
      >
        {props.name}
      </div>

      {/* Hidden File Input */}
      {props.functional == null ||
        (props.functional == true && (
          <input
            type="file"
            id="fileInput"
            accept={fileType?.toString() ?? ""}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        ))}
    </div>
  );
};

export default UploadCard;
