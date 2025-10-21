import styled, { keyframes } from "styled-components";

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

export interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary";
}

const sizeMap = {
  sm: "16px",
  md: "24px",
  lg: "40px",
};

export const Spinner = styled.div<SpinnerProps>`
  width: ${({ size = "md" }) => sizeMap[size]};
  height: ${({ size = "md" }) => sizeMap[size]};
  border: 2px solid ${({ theme, variant = "primary" }) => 
    variant === "primary" ? theme.colors.primary : theme.colors.text.tertiary};
  border-top-color: transparent;
  border-radius: ${({ theme }) => theme.radii.pill};
  animation: ${spin} 600ms linear infinite;
`;

export const LoadingDots = styled.div`
  display: inline-flex;
  gap: 6px;
  align-items: center;

  &::before,
  &::after,
  span {
    content: "";
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: ${({ theme }) => theme.radii.pill};
    background: ${({ theme }) => theme.colors.text.secondary};
    animation: ${pulse} 1.4s ease-in-out infinite;
  }

  &::before {
    animation-delay: 0s;
  }

  span {
    animation-delay: 0.2s;
  }

  &::after {
    animation-delay: 0.4s;
  }
`;

export const LoadingOverlay = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.backgrounds.overlay};
  backdrop-filter: blur(8px);
  z-index: ${({ theme }) => theme.zIndices.overlay};
`;

export default Spinner;
