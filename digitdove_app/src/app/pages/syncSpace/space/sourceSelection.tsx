'use client'
import React from "react";
import styled, { keyframes } from "styled-components";
import { useTheme } from "@/app/providers/ThemeContext";

type SourceSelectionProps = {
  open: boolean;
  onClose: () => void;
  upload: (file: File) => void;
};

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

const slideUp = keyframes`
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
`;

const slideDown = keyframes`
  from { transform: translateY(0); }
  to { transform: translateY(100%); }
`;

const Overlay = styled.div<{ open: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: ${({ open }) => (open ? "1" : "0")};
  animation: ${({ open }) => (open ? fadeIn : fadeOut)} 0.5s forwards;
  z-index: 1000; /* Ensure it's on top of other elements */
`;

const PopupContainer = styled.div<{ open: boolean }>`
  background-color: white;
  width: 80%;
  max-width: 600px;
  border-radius: 12px;
  padding: 20px;
  animation: ${({ open }) => (open ? slideUp : slideDown)} 0.5s forwards;
`;

const CloseButton = styled.button`
  background-color: red;
  color: white;
  border: none;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
  border-radius: 6px;
`;

const SourceSelection: React.FC<SourceSelectionProps> = ({ open, onClose, upload }) => {
    const {theme} = useTheme()
  return (
    <Overlay open={open}>
      <PopupContainer open={open}>
        <div>Add Data Source(s)</div>

        {/* Example selection options */}
        <div
          style={{
            wordBreak: "break-all", // This will break the text to fit within the available space
            maxWidth: "200px", // Optional: set a max width for the filename display
          }}
        >
          {/* Hidden file input */}
          <input
            type="file"
            id="fileInput"
            accept=".docx"
            style={{ display: "none" }} // Hide the file input
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              const file = event.target.files?.[0]; // Get the selected file
              if (file) {
                upload(file); // Call the upload function with the new file
              }
            }}
          />

          {/* Label as the button that triggers the file input */}
          <label
            htmlFor="fileInput" // Ties the label to the hidden file input
            style={{
              cursor: "pointer", // Make it clear this is clickable
              color: theme.brand500, // Optional: Add some styling for the reupload button
              textDecoration: "underline", // Optional: Add underline for link effect
            }}
          >
            Reupload
          </label>
        </div>

        <CloseButton onClick={onClose}>Close</CloseButton>
      </PopupContainer>
    </Overlay>
  );
};

export default SourceSelection;
