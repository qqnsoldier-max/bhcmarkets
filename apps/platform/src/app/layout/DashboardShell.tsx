import { NavLink, Outlet } from "react-router-dom";
import styled from "styled-components";
import { Badge, Button, MenuLink, Divider } from "@repo/ui";
import { TopBar } from "./TopBar";

const Shell = styled.div`
  min-height: 100vh;
  display: grid;
  grid-template-columns: ${({ theme }) => `${theme.layout.sidebarWidth} minmax(0, 1fr)`};
  grid-template-rows: auto 1fr;
  grid-template-areas:
    "sidebar topbar"
    "sidebar main";
`;

const Sidebar = styled.aside`
  grid-area: sidebar;
  padding: ${({ theme }) => theme.spacing.xl};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  border-right: 1px solid ${({ theme }) => theme.colors.border.subtle};
  background: linear-gradient(140deg, rgba(12, 20, 42, 0.95), rgba(9, 14, 34, 0.75));
  overflow-y: auto;
`;

const Brand = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const BrandMark = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.gradients.primary};
  font-weight: ${({ theme }) => theme.typography.weightSemiBold};
  font-size: 1.2rem;
  letter-spacing: 0.12em;
`;

const BrandLabel = styled.span`
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.28em;
  color: ${({ theme }) => theme.colors.neutral400};
`;

const NavSection = styled.nav`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const SectionLabel = styled.span`
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: ${({ theme }) => theme.colors.neutral600};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const SidebarFooter = styled.div`
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const TopBarArea = styled.div`
  grid-area: topbar;
`;

const Main = styled.main`
  grid-area: main;
  padding: ${({ theme }) => theme.spacing.xl};
  background: transparent;
  overflow-y: auto;
  max-height: calc(100vh - ${({ theme }) => theme.layout.topbarHeight});
`;

const Content = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.xl};
  max-width: ${({ theme }) => theme.layout.contentMaxWidth};
  width: 100%;
  margin: 0 auto;
`;

const DASHBOARD_ROOT = "/app" as const;

const menuItems = [
  { label: "Overview", to: DASHBOARD_ROOT, icon: "🏠", tooltip: "Dashboard overview and key metrics" },
  { label: "Portfolio", to: `${DASHBOARD_ROOT}/portfolio`, icon: "💼", tooltip: "View your portfolio and positions" },
  { label: "Markets", to: `${DASHBOARD_ROOT}/markets`, icon: "📈", tooltip: "Explore market data and trends" },
  { label: "Orders", to: `${DASHBOARD_ROOT}/orders`, icon: "🧾", tooltip: "Manage your orders and trades" },
  { label: "Settings", to: `${DASHBOARD_ROOT}/settings`, icon: "⚙️", tooltip: "Configure platform settings" },
] as const;

const QuickLinksSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const QuickLink = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm};
  background: transparent;
  border: none;
  border-radius: ${({ theme }) => theme.radii.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.fast};
  text-align: left;

  &:hover {
    background: rgba(255, 255, 255, 0.04);
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

export const DashboardShell = () => (
  <Shell>
    <Sidebar>
      <Brand>
        <BrandMark>BHV</BrandMark>
        <BrandLabel>Markets</BrandLabel>
      </Brand>

      <div>
        <SectionLabel>Navigation</SectionLabel>
        <NavSection>
          {menuItems.map((item) => (
            <MenuLink
              key={item.to}
              as={NavLink}
              to={item.to}
              end={item.to === DASHBOARD_ROOT}
              label={item.label}
              icon={item.icon}
              title={item.tooltip}
            />
          ))}
        </NavSection>
      </div>

      <Divider spacing="sm" />

      <div>
        <SectionLabel>Quick Links</SectionLabel>
        <QuickLinksSection>
          <QuickLink>
            <span>📚</span> Documentation
          </QuickLink>
          <QuickLink>
            <span>🎓</span> Learning Center
          </QuickLink>
          <QuickLink>
            <span>📞</span> Support
          </QuickLink>
        </QuickLinksSection>
      </div>

      <SidebarFooter>
        <Badge variant="accent">Premium</Badge>
        <p>
          Upgrade your account for deeper analytics, white-labeled reporting, and advanced signals.
        </p>
        <Button variant="secondary" size="sm">Upgrade Plan</Button>
      </SidebarFooter>
    </Sidebar>

    <TopBarArea>
      <TopBar />
    </TopBarArea>

    <Main>
      <Content>
        <Outlet />
      </Content>
    </Main>
  </Shell>
);

export default DashboardShell;
