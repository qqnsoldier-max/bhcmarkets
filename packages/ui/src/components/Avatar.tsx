import { forwardRef, type HTMLAttributes } from "react";
import styled from "styled-components";

type AvatarSize = "sm" | "md" | "lg";

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  size?: AvatarSize;
  initials?: string;
  status?: "online" | "offline" | "away" | "busy";
}

const avatarSizes = {
  sm: "32px",
  md: "40px",
  lg: "56px",
};

const AvatarContainer = styled.div<{ $size: AvatarSize }>`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${({ $size }) => avatarSizes[$size]};
  height: ${({ $size }) => avatarSizes[$size]};
  border-radius: ${({ theme }) => theme.radii.pill};
  overflow: hidden;
  background: ${({ theme }) => theme.gradients.primary};
  color: ${({ theme }) => theme.colors.text.onAccent};
  font-size: ${({ $size }) => ($size === "sm" ? "0.75rem" : $size === "md" ? "0.9rem" : "1.1rem")};
  font-weight: ${({ theme }) => theme.typography.weightSemiBold};
  flex-shrink: 0;
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const StatusIndicator = styled.div<{ $status: "online" | "offline" | "away" | "busy" }>`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 10px;
  height: 10px;
  border-radius: ${({ theme }) => theme.radii.pill};
  border: 2px solid ${({ theme }) => theme.colors.backgrounds.app};
  background: ${({ $status, theme }) => {
    switch ($status) {
      case "online":
        return theme.colors.status.success;
      case "offline":
        return theme.colors.neutral600;
      case "away":
        return theme.colors.status.warning;
      case "busy":
        return theme.colors.status.danger;
    }
  }};
`;

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ src, alt = "User avatar", size = "md", initials, status, ...props }, ref) => {
    return (
      <AvatarContainer ref={ref} $size={size} {...props}>
        {src ? <AvatarImage src={src} alt={alt} /> : <span>{initials || "U"}</span>}
        {status && <StatusIndicator $status={status} />}
      </AvatarContainer>
    );
  }
);

Avatar.displayName = "Avatar";

export default Avatar;
