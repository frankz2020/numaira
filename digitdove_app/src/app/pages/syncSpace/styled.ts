import styled from "styled-components";
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