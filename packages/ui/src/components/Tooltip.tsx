import { forwardRef, type ReactNode, useState } from "react";
import styled from "styled-components";

export interface TooltipProps {
  content: string;
  children: ReactNode;
  placement?: "top" | "bottom" | "left" | "right";
  delay?: number;
}

const TooltipContainer = styled.div`
  position: relative;
  display: inline-flex;
`;

const TooltipContent = styled.div<{ $placement: "top" | "bottom" | "left" | "right" }>`
  position: absolute;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.backgrounds.elevated};
  color: ${({ theme }) => theme.colors.text.primary};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.sm};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  white-space: nowrap;
  z-index: ${({ theme }) => theme.zIndices.toast};
  pointer-events: none;
  box-shadow: ${({ theme }) => theme.shadows.soft};
  backdrop-filter: blur(8px);

  ${({ $placement }) => {
    switch ($placement) {
      case "top":
        return `
          bottom: calc(100% + 8px);
          left: 50%;
          transform: translateX(-50%);
        `;
      case "bottom":
        return `
          top: calc(100% + 8px);
          left: 50%;
          transform: translateX(-50%);
        `;
      case "left":
        return `
          right: calc(100% + 8px);
          top: 50%;
          transform: translateY(-50%);
        `;
      case "right":
        return `
          left: calc(100% + 8px);
          top: 50%;
          transform: translateY(-50%);
        `;
    }
  }}

  opacity: 0;
  animation: tooltipFadeIn 150ms ease forwards;

  @keyframes tooltipFadeIn {
    to {
      opacity: 1;
    }
  }

  &::before {
    content: "";
    position: absolute;
    width: 0;
    height: 0;
    border: 4px solid transparent;

    ${({ $placement, theme }) => {
      switch ($placement) {
        case "top":
          return `
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            border-top-color: ${theme.colors.border.default};
          `;
        case "bottom":
          return `
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            border-bottom-color: ${theme.colors.border.default};
          `;
        case "left":
          return `
            left: 100%;
            top: 50%;
            transform: translateY(-50%);
            border-left-color: ${theme.colors.border.default};
          `;
        case "right":
          return `
            right: 100%;
            top: 50%;
            transform: translateY(-50%);
            border-right-color: ${theme.colors.border.default};
          `;
      }
    }}
  }
`;

export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  ({ content, children, placement = "top", delay = 300 }, ref) => {
    const [isVisible, setIsVisible] = useState(false);
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

    const handleMouseEnter = () => {
      const id = setTimeout(() => setIsVisible(true), delay);
      setTimeoutId(id);
    };

    const handleMouseLeave = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      setIsVisible(false);
    };

    return (
      <TooltipContainer
        ref={ref}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleMouseEnter}
        onBlur={handleMouseLeave}
      >
        {children}
        {isVisible && <TooltipContent $placement={placement}>{content}</TooltipContent>}
      </TooltipContainer>
    );
  }
);

Tooltip.displayName = "Tooltip";

export default Tooltip;
