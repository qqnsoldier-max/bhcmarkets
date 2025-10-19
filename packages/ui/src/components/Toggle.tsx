import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import styled from "styled-components";

const ToggleLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

const HiddenCheckbox = styled.input.attrs({ type: "checkbox" })`
  position: absolute;
  opacity: 0;
  pointer-events: none;
`;

const Track = styled.span<{ $checked: boolean }>`
  position: relative;
  width: 48px;
  height: 26px;
  background: ${({ $checked }) => ($checked ? "rgba(63, 140, 255, 0.4)" : "rgba(148, 163, 184, 0.2)")};
  border-radius: ${({ theme }) => theme.radii.pill};
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: ${({ theme }) => theme.transitions.base};
  box-shadow: inset 0 2px 4px rgba(3, 6, 18, 0.4);

  &::after {
    content: "";
    position: absolute;
    top: 3px;
    left: ${({ $checked }) => ($checked ? "22px" : "3px")};
    width: 20px;
    height: 20px;
    border-radius: ${({ theme }) => theme.radii.pill};
    background: ${({ theme }) => theme.gradients.primary};
    transition: ${({ theme }) => theme.transitions.base};
    box-shadow: 0 4px 12px rgba(63, 140, 255, 0.3);
  }
`;

export interface ToggleProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode;
}

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(({ checked, label, ...props }, ref) => (
  <ToggleLabel>
    <HiddenCheckbox ref={ref} checked={checked} {...props} />
    <Track aria-hidden $checked={Boolean(checked)} />
    {label && <span>{label}</span>}
  </ToggleLabel>
));

Toggle.displayName = "Toggle";

export default Toggle;
