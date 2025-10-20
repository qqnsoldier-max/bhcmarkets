import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Card, CardBody, CardHeader, CardTitle } from "@repo/ui";
import { LoginForm } from "./components/LoginForm";
import { RegisterForm } from "./components/RegisterForm";

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.backgrounds.base};
`;

const AuthCard = styled(Card)`
  width: 100%;
  max-width: 480px;
`;

const TabContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.subtle};
`;

const Tab = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background: transparent;
  border: none;
  border-bottom: 2px solid ${({ $active, theme }) => ($active ? theme.colors.primary : "transparent")};
  color: ${({ $active, theme }) => ($active ? theme.colors.text.primary : theme.colors.text.secondary)};
  font-size: ${({ theme }) => theme.typography.sizes.base};
  font-weight: ${({ theme }) => theme.typography.weightMedium};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.base};

  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const Logo = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const LogoText = styled.h1`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.sizes.xxl};
  font-weight: ${({ theme }) => theme.typography.weightBold};
  background: ${({ theme }) => theme.gradients.primary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  margin: ${({ theme }) => theme.spacing.xs} 0 0;
  color: ${({ theme }) => theme.colors.text.tertiary};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
`;

type AuthMode = "login" | "signup";

export const AuthPage = () => {
  const [mode, setMode] = useState<AuthMode>("login");
  const navigate = useNavigate();

  const handleAuthSuccess = () => {
    // Redirect to dashboard after successful auth
    navigate("/");
  };

  return (
    <PageContainer>
      <AuthCard>
        <CardHeader>
          <Logo>
            <LogoText>BHC Markets</LogoText>
            <Subtitle>Professional Trading Platform</Subtitle>
          </Logo>
        </CardHeader>
        <CardBody>
          <TabContainer>
            <Tab $active={mode === "login"} onClick={() => setMode("login")}>
              Log In
            </Tab>
            <Tab $active={mode === "signup"} onClick={() => setMode("signup")}>
              Sign Up
            </Tab>
          </TabContainer>

          {mode === "login" ? (
            <LoginForm onSuccess={handleAuthSuccess} onSwitchToSignup={() => setMode("signup")} />
          ) : (
            <RegisterForm onSuccess={handleAuthSuccess} onSwitchToLogin={() => setMode("login")} />
          )}
        </CardBody>
      </AuthCard>
    </PageContainer>
  );
};

export default AuthPage;
