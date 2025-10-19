import { useState } from "react";
import styled from "styled-components";
import { Badge, Button, Card, CardBody, CardHeader, CardSubtitle, CardTitle, StatBlock, Toggle } from "@repo/ui";

type WatchlistEntry = {
  symbol: string;
  change: string;
  status: "success" | "warning" | "danger" | "default" | "accent";
};

const Page = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const TopBar = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
  flex-wrap: wrap;
`;

const TopBarLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const TopBarTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.sizes.xl};
  letter-spacing: -0.01em;
`;

const TopBarMeta = styled.p`
  color: ${({ theme }) => theme.colors.text.tertiary};
  font-size: ${({ theme }) => theme.typography.sizes.base};
`;

const TopBarActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const StatsGrid = styled.section`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
`;

const CardsGrid = styled.section`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
`;

const ChartPlaceholder = styled.div`
  height: 200px;
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px dashed rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.04);
`;

const TablePlaceholder = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.subtle};

  &:last-of-type {
    border-bottom: none;
  }
`;

const watchlistMock: WatchlistEntry[] = [
  { symbol: "BHV", change: "+2.81%", status: "success" },
  { symbol: "ALPHA", change: "-1.13%", status: "danger" },
  { symbol: "XBT", change: "+5.92%", status: "success" },
];

export const DashboardOverviewPage = () => {
  const [liveMode, setLiveMode] = useState(true);

  return (
    <Page>
      <TopBar>
        <TopBarLeft>
          <TopBarTitle>Dashboard</TopBarTitle>
          <TopBarMeta>Curated insights across your multi-asset holdings</TopBarMeta>
        </TopBarLeft>
        <TopBarActions>
          <Toggle
            checked={liveMode}
            onChange={(event) => setLiveMode(event.target.checked)}
            label="Live mode"
          />
          <Button>New Order</Button>
        </TopBarActions>
      </TopBar>

      <StatsGrid>
        <StatBlock label="Equity Value" value="$1.84M" trend="+4.2%" trendDirection="up" meta="vs. last 24h" />
        <StatBlock label="Daily P/L" value="+$38.5K" trend="+1.8%" trendDirection="up" meta="Across all strategies" />
        <StatBlock label="Risk Utilization" value="42%" trend="-3.5%" trendDirection="down" meta="of available margin" />
        <StatBlock label="Win Rate" value="67%" trend="+2.1%" trendDirection="up" meta="Last 30 days" />
      </StatsGrid>

      <CardsGrid>
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Performance Overview</CardTitle>
              <CardSubtitle>Strategy blend across equities, FX, and crypto</CardSubtitle>
            </div>
            <Badge variant="default">Last 30 days</Badge>
          </CardHeader>
          <CardBody>
            <ChartPlaceholder aria-hidden />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Active Watchlist</CardTitle>
              <CardSubtitle>Signals refresh every 15 seconds</CardSubtitle>
            </div>
            <Button variant="subtle" size="sm">
              Manage
            </Button>
          </CardHeader>
          <CardBody>
            <TablePlaceholder>
              {watchlistMock.map((item) => (
                <TableRow key={item.symbol}>
                  <span>{item.symbol}</span>
                  <Badge variant={item.status}>{item.change}</Badge>
                  <Button variant="outline" size="sm">
                    Trade
                  </Button>
                </TableRow>
              ))}
            </TablePlaceholder>
          </CardBody>
        </Card>
      </CardsGrid>
    </Page>
  );
};

export default DashboardOverviewPage;
