import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useTheme } from "../providers/ThemeContext";
import { useFormat } from "../providers/FormatContext";

interface ProgressBarProps {
  isComplete: boolean;
}

const ProgressBarWrapper = styled.div<{ theme: any; format: any }>`
  border: 2px solid ${(props) => props.theme.neutral300};
  width: 100%;
  padding: 1px;
  background-color: ${(props) => props.theme.neutral100};
  border-radius: ${(props) => props.format.roundmd};
  overflow: hidden;
`;

const Progress = styled.div<{ progress: number; theme: any; format: any }>`
  width: ${(props) => props.progress}%;
  height: 10px;
  padding: 1px;
  background-color: ${(props) => props.theme.brand500};
  border-radius: ${(props) => props.format.roundmd};
  transition: width 0.5s ease;
`;

const ProgressBar: React.FC<ProgressBarProps> = ({ isComplete }) => {
  const [progress, setProgress] = useState(0);
  const { theme } = useTheme();
  const { format } = useFormat();

  useEffect(() => {
    if (isComplete) {
      setProgress(100);
      return;
    }

    let increment = 1; // Initial increment value
    const totalDuration = 10000; // Total duration for the progress bar (e.g., 10 seconds)
    const maxProgress = 99;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + increment;

        // Adjust increment value based on current progress
        if (newProgress < 30) {
          increment = 0.3; // Fast increment
        } else if (newProgress < 90) {
          increment = 0.1; // Medium increment
        } else {
          increment = 0.01; // Slow increment
        }

        return Math.min(newProgress, maxProgress);
      });
    }, totalDuration / maxProgress);

    return () => clearInterval(interval);
  }, [isComplete]);

  return (
    <ProgressBarWrapper theme={theme} format={format}>
      <Progress progress={progress} theme={theme} format={format} />
    </ProgressBarWrapper>
  );
};

export default ProgressBar;
