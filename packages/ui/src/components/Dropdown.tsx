import { forwardRef, type ReactNode, useEffect, useRef, useState } from "react";
import styled from "styled-components";

export interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  align?: "left" | "right";
  width?: string;
}

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownTrigger = styled.div`
  display: inline-flex;
  cursor: pointer;

  &:focus-within {
    outline: 2px solid ${({ theme }) => theme.colors.focus};
    outline-offset: 2px;
    border-radius: ${({ theme }) => theme.radii.sm};
  }
`;

const DropdownMenu = styled.div<{ $align: "left" | "right"; $width?: string }>`
  position: absolute;
  top: calc(100% + ${({ theme }) => theme.spacing.xs});
  ${({ $align }) => ($align === "right" ? "right: 0;" : "left: 0;")}
  width: ${({ $width }) => $width || "220px"};
  background: ${({ theme }) => theme.colors.backgrounds.elevated};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow: ${({ theme }) => theme.elevations.overlay};
  padding: ${({ theme }) => theme.spacing.xs};
  z-index: ${({ theme }) => theme.zIndices.dropdown};
  backdrop-filter: blur(12px);

  opacity: 0;
  transform: translateY(-8px);
  animation: dropdownFadeIn 180ms ease forwards;

  @keyframes dropdownFadeIn {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(
  ({ trigger, children, align = "left", width }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };

      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("keydown", handleEscape);
      };
    }, [isOpen]);

    return (
      <DropdownContainer ref={containerRef}>
        <DropdownTrigger
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-haspopup="true"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setIsOpen(!isOpen);
            }
          }}
        >
          {trigger}
        </DropdownTrigger>
        {isOpen && (
          <DropdownMenu ref={ref} $align={align} $width={width} role="menu">
            {children}
          </DropdownMenu>
        )}
      </DropdownContainer>
    );
  }
);

Dropdown.displayName = "Dropdown";

export const DropdownItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background: transparent;
  border: none;
  border-radius: ${({ theme }) => theme.radii.sm};
  color: ${({ theme }) => theme.colors.text.primary};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.sizes.base};
  text-align: left;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.backgrounds.app};
  }

  &:focus-visible {
    outline: none;
    background: ${({ theme }) => theme.colors.backgrounds.app};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.focus};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const DropdownDivider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.colors.border.subtle};
  margin: ${({ theme }) => theme.spacing.xs} 0;
`;

export default Dropdown;
