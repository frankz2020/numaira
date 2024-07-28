import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useTheme } from "../providers/ThemeContext";
import { useFormat } from "../providers/FormatContext";

interface ProgressBarProps {
  duration: number; // Duration for the progress bar animation
}

const ProgressBarWrapper = styled.div<{ theme: any; format: any }>`
  border: 2px solid ${(props) => props.theme.neutral300};
  width: 100%;
  padding: 1px;
  background-color: ${(props) => props.theme.neutral100};
  border-radius: ${(props) => props.format.roundmd};
  overflow: hidden;
`;

const Progress = styled.div<{ progress: number,  format: any  }>`
  width: ${(props) => props.progress}%;
  height: 10px;
  padding: 1px;
  background-color: ${(props) => props.theme.brand500};
   border-radius: ${(props) => props.format.roundmd};
  transition: width 0.5s ease;
`;

const ProgressBar: React.FC<ProgressBarProps> = ({ duration }) => {
  const [progress, setProgress] = useState(0);
  const { theme } = useTheme();
  const { format } = useFormat();
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prevProgress + 1;
      });
    }, duration / 100);

    return () => clearInterval(interval);
  }, [duration]);

  return (
    <ProgressBarWrapper theme={theme} format={format}>
      <Progress progress={progress} theme={theme} format={format}/>
    </ProgressBarWrapper>
  );
};

export default ProgressBar;
