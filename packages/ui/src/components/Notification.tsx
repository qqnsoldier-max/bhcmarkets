import { type ReactNode } from "react";
import styled, { keyframes } from "styled-components";

export interface NotificationProps {
  type?: "info" | "success" | "warning" | "error";
  title?: string;
  message: ReactNode;
  onClose?: () => void;
}

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const NotificationContainer = styled.div<{ $type: "info" | "success" | "warning" | "error" }>`
  min-width: 320px;
  max-width: 480px;
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.backgrounds.elevated};
  border: 1px solid ${({ theme, $type }) => {
    switch ($type) {
      case "success": return theme.colors.status.success;
      case "warning": return theme.colors.status.warning;
      case "error": return theme.colors.status.danger;
      default: return theme.colors.border.accent;
    }
  }};
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow: ${({ theme }) => theme.elevations.overlay};
  backdrop-filter: blur(12px);
  animation: ${slideIn} 300ms ease;
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: flex-start;
`;

const NotificationIcon = styled.div<{ $type: "info" | "success" | "warning" | "error" }>`
  font-size: 1.25rem;
  flex-shrink: 0;
  color: ${({ theme, $type }) => {
    switch ($type) {
      case "success": return theme.colors.status.success;
      case "warning": return theme.colors.status.warning;
      case "error": return theme.colors.status.danger;
      default: return theme.colors.primary;
    }
  }};
`;

const NotificationContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xxs};
`;

const NotificationTitle = styled.div`
  font-weight: ${({ theme }) => theme.typography.weightSemiBold};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.sizes.base};
`;

const NotificationMessage = styled.div`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.text.tertiary};
  cursor: pointer;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radii.sm};
  transition: ${({ theme }) => theme.transitions.fast};
  flex-shrink: 0;

  &:hover {
    background: ${({ theme }) => theme.colors.backgrounds.app};
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const iconMap = {
  info: "ℹ️",
  success: "✓",
  warning: "⚠️",
  error: "✕",
};

export const Notification = ({ type = "info", title, message, onClose }: NotificationProps) => (
  <NotificationContainer $type={type}>
    <NotificationIcon $type={type}>{iconMap[type]}</NotificationIcon>
    <NotificationContent>
      {title && <NotificationTitle>{title}</NotificationTitle>}
      <NotificationMessage>{message}</NotificationMessage>
    </NotificationContent>
    {onClose && <CloseButton onClick={onClose}>✕</CloseButton>}
  </NotificationContainer>
);

export default Notification;
