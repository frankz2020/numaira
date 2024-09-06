import styled, { keyframes, css } from "styled-components";
export const HorizontalArrow = styled.div<{ direction: string }>`
  --c: ${(props) => props.theme.neutral700}; /* color */
  --r: 5px; /* circle size */
  --s: 5px; /* space between circles */
  --size: 15px; /* arrow tip size */

  height: 6px;
  width: 100%; /* Adjust width as needed */
  display: inline-block;
  position: relative;
  --g: radial-gradient(circle closest-side, var(--c) 85%, transparent);
  background: var(--g) 0 calc(var(--s) / -2) / var(--r)
      calc(var(--r) + var(--s)) repeat-y,
    var(--g) calc(var(--s) / -2) 0 / calc(var(--r) + var(--s)) var(--r) repeat-x;

  &::after {
    content: "";
    position: absolute;
    left: ${(props) => (props.direction === "left" ? "0" : "100%")};
    top: 50%;
    width: var(--size);
    height: var(--size);
    transform: translate(-50%, -50%)
      rotate(${(props) => (props.direction === "left" ? "-90deg" : "90deg")});
    clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
    background: var(--c);
  }
`;

export const VerticalArrow = styled.div<{ direction: string }>`
  --c: ${(props) => props.theme.neutral700}; /* color */
  --r: 5px; /* circle size */
  --s: 5px; /* space between circles */
  --size: 15px; /* arrow tip size */

  width: 6px;
  height: 100%; /* Adjust height as needed */
  display: inline-block;
  position: relative;
  --g: radial-gradient(circle closest-side, var(--c) 85%, transparent);
  background: var(--g) calc(var(--s) / -2) 0 / calc(var(--r) + var(--s))
      var(--r) repeat-x,
    var(--g) 0 calc(var(--s) / -2) / var(--r) calc(var(--r) + var(--s)) repeat-y;

  &::after {
    content: "";
    position: absolute;
    top: ${(props) => (props.direction === "up" ? "0" : "100%")};
    left: 50%;
    width: var(--size);
    height: var(--size);
    transform: translate(-50%, -50%)
      rotate(${(props) => (props.direction === "up" ? "0deg" : "180deg")});
    clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
    background: var(--c);
  }
`;




export const FileVisualDiv = styled.div<{
  dotted: boolean;
  theme: any;
  opacity: number;
  borderColor?: string | null;
  isProcessing?: boolean;
}>`
  max-width: 280px;
  min-width: 200px;
  width: 25%;
  height: auto;
  min-height: 220px;
  align-items: center;
  border-radius: 8px;
  opacity: ${(props) => props.opacity};
  border: ${(props) =>
    props.dotted
      ? "2px dotted " + props.theme.neutral1000
      : "2px solid " + props.theme.neutral100};
  background-color: ${(props) => props.theme.neutral100} !important;
  position: relative;

  ${(props) =>
    props.isProcessing &&
    css`
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(255, 255, 255, 0.6);
        z-index: 1;
      }

      &::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 40px;
        height: 40px;
        margin: -20px 0 0 -20px;
        border: 4px solid ${props.theme.brand500};
        border-top: 4px solid ${props.theme.neutral100};
        border-radius: 50%;
        animation: ${spin} 1s linear infinite;
        z-index: 2;
      }
    `}
`;


export const FileDisplayContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  margin-bottom: 4px;
  background-color: ${(props) => props.theme.neutral};
`;

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;
