import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Avatar, Button, Dropdown, DropdownDivider, DropdownItem, Tooltip } from "@repo/ui";

const TopBarContainer = styled.header`
  height: ${({ theme }) => theme.layout.topbarHeight};
  background: ${({ theme }) => theme.colors.backgrounds.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.subtle};
  padding: 0 ${({ theme }) => theme.spacing.xl};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.lg};
  position: sticky;
  top: 0;
  z-index: ${({ theme }) => theme.zIndices.sidebar};
  backdrop-filter: blur(12px);
`;

const TopBarLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
  flex: 1;
`;

const SearchContainer = styled.div`
  flex: 1;
  max-width: 480px;
  position: relative;
`;

const SearchInput = styled.input`
  width: 100%;
  height: 40px;
  padding: 0 ${({ theme }) => theme.spacing.md} 0 ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.colors.backgrounds.app};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.text.primary};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.sizes.base};
  transition: ${({ theme }) => theme.transitions.base};

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.tertiary};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.focus};
  }
`;

const SearchIcon = styled.span`
  position: absolute;
  left: ${({ theme }) => theme.spacing.sm};
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.text.tertiary};
  font-size: 1.1rem;
`;

const TopBarRight = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const QuickAction = styled.button`
  height: 40px;
  width: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.backgrounds.app};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.fast};
  font-size: 1.2rem;

  &:hover {
    background: ${({ theme }) => theme.colors.backgrounds.elevated};
    color: ${({ theme }) => theme.colors.text.primary};
    border-color: ${({ theme }) => theme.colors.border.accent};
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.focus};
  }
`;

const UserMenuTrigger = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.xxs};
  background: transparent;
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.radii.md};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.backgrounds.app};
    border-color: ${({ theme }) => theme.colors.border.subtle};
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.focus};
  }
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
`;

const UserName = styled.span`
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ theme }) => theme.typography.weightMedium};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const UserEmail = styled.span`
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

const ChevronIcon = styled.span`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

const DropdownIcon = styled.span`
  font-size: 1.1rem;
  min-width: 20px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const TopBar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear any auth tokens/session data
    localStorage.removeItem("authToken");
    sessionStorage.clear();
    // Redirect to auth page
    navigate("/auth", { replace: true });
  };

  const handleHelp = () => {
    window.open("https://docs.bhcmarkets.com", "_blank");
  };

  const handleContact = () => {
    window.open("mailto:support@bhcmarkets.com", "_blank");
  };

  return (
    <TopBarContainer>
      <TopBarLeft>
        <SearchContainer>
          <SearchIcon>🔍</SearchIcon>
          <SearchInput
            type="text"
            placeholder="Search markets, orders, or portfolio..."
            aria-label="Search"
          />
        </SearchContainer>
      </TopBarLeft>

      <TopBarRight>
        <Tooltip content="Notifications" placement="bottom">
          <QuickAction aria-label="Notifications">
            🔔
          </QuickAction>
        </Tooltip>

        <Tooltip content="Quick Trade" placement="bottom">
          <QuickAction aria-label="Quick Trade">
            ⚡
          </QuickAction>
        </Tooltip>

        <Tooltip content="Analytics" placement="bottom">
          <QuickAction aria-label="Analytics">
            📊
          </QuickAction>
        </Tooltip>

        <Dropdown
          align="right"
          width="260px"
          trigger={
            <UserMenuTrigger aria-label="User menu">
              <Avatar
                size="sm"
                initials="JD"
                status="online"
              />
              <UserInfo>
                <UserName>John Doe</UserName>
                <UserEmail>john.doe@example.com</UserEmail>
              </UserInfo>
              <ChevronIcon>▼</ChevronIcon>
            </UserMenuTrigger>
          }
        >
          <DropdownItem onClick={() => navigate("/app/settings")} role="menuitem">
            <DropdownIcon>👤</DropdownIcon>
            My Profile
          </DropdownItem>
          <DropdownItem onClick={() => navigate("/app/settings")} role="menuitem">
            <DropdownIcon>⚙️</DropdownIcon>
            Settings
          </DropdownItem>
          <DropdownDivider />
          <DropdownItem onClick={handleHelp} role="menuitem">
            <DropdownIcon>❓</DropdownIcon>
            Help & Documentation
          </DropdownItem>
          <DropdownItem onClick={handleContact} role="menuitem">
            <DropdownIcon>✉️</DropdownIcon>
            Contact Support
          </DropdownItem>
          <DropdownDivider />
          <DropdownItem onClick={handleLogout} role="menuitem">
            <DropdownIcon>🚪</DropdownIcon>
            Logout
          </DropdownItem>
        </Dropdown>
      </TopBarRight>
    </TopBarContainer>
  );
};

export default TopBar;
