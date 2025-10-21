import styled from "styled-components";

export interface DividerProps {
  orientation?: "horizontal" | "vertical";
  spacing?: "sm" | "md" | "lg";
}

const spacingMap = {
  sm: "xs",
  md: "sm",
  lg: "md",
} as const;

export const Divider = styled.div<DividerProps>`
  ${({ orientation = "horizontal", spacing = "md", theme }) => {
    const spacingValue = theme.spacing[spacingMap[spacing]];
    
    if (orientation === "horizontal") {
      return `
        height: 1px;
        width: 100%;
        background: ${theme.colors.border.subtle};
        margin: ${spacingValue} 0;
      `;
    } else {
      return `
        width: 1px;
        height: 100%;
        background: ${theme.colors.border.subtle};
        margin: 0 ${spacingValue};
      `;
    }
  }}
`;

export default Divider;
