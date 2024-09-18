import styled from "styled-components"
import format from "../theme/Space.json"
import theme from "../theme/Color.json"
export const TitleText = styled.div`
position:relatvie;
padding-top: 48px;
padding-bottom:24px;
width: 100%;
font-size: ${format.textXL};
font-weight: bold;
`

export const StyledNeutralButton = styled.button`
  padding: 0.5rem 1rem;
  cursor: pointer;
  border: 1.5px solid ${theme.primary};
  border-radius: ${format.roundmd};
  font-weight: bold;
  color: ${theme.primary};
  background-color: transparent;
  transition: opacity 0.3s, color 0.3s;

  &:hover {
    opacity: 0.5;
  }
`;

export const StyledPrimaryButton = styled.button`
  padding: 0.5rem 1rem;
  cursor: pointer;
  border: 1px solid ${theme.primary};
  border-radius: ${format.roundmd};
  font-weight: bold;
  color: ${theme.neutral};
  background-color: ${theme.primary};
  transition: opacity 0.3s, color 0.3s;

  &:hover {
    opacity: 0.8;
  }
`;



export const StyledSecondaryButton = styled.button`
  padding: 0.5rem 1rem;
  cursor: pointer;
  border: 1px solid ${theme.primary};
  border-radius: ${format.roundmd};
  font-weight: bold;
  color: ${theme.brand500};
  background-color: ${theme.brand};
  transition: opacity 0.3s, color 0.3s;

  &:hover {
    opacity: 0.8;
  }
`;