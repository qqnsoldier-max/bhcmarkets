import styled from "styled-components";
import {
  Badge,
  Card,
  CardBody,
  CardHeader,
  CardSubtitle,
  CardTitle,
  StatBlock,
} from "@repo/ui";

const Page = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const Header = styled.header`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.sizes.xl};
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.text.tertiary};
  font-size: ${({ theme }) => theme.typography.sizes.base};
`;

const Grid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
`;

const StatRow = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
`;

const PlaceholderCopy = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

export const MarketsPage = (): JSX.Element => (
  <Page>
    <Header>
      <Title>Markets</Title>
      <Subtitle>Live pricing, spreads, and session context will render here.</Subtitle>
    </Header>

    <StatRow>
      <StatBlock label="US Equities" value="+1.12%" trend="+0.6%" trendDirection="up" meta="S&P 500" />
      <StatBlock label="FX Majors" value="-0.22%" trend="-0.1%" trendDirection="down" meta="DXY" />
      <StatBlock label="Crypto" value="+3.48%" trend="+1.2%" trendDirection="up" meta="Top 10 mcap" />
    </StatRow>

    <Grid>
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Order Book</CardTitle>
            <CardSubtitle>Depth aggregation placeholder</CardSubtitle>
          </div>
          <Badge variant="default">Mock</Badge>
        </CardHeader>
        <CardBody>
          <PlaceholderCopy>
            Slot for book visualisations, e.g. laddered bars or time and sales streams.
          </PlaceholderCopy>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Volatility Surface</CardTitle>
        </CardHeader>
        <CardBody>
          <PlaceholderCopy>
            Attach implied vols or sigma curves once the analytics pipeline is connected.
          </PlaceholderCopy>
        </CardBody>
      </Card>
    </Grid>
  </Page>
);

export default MarketsPage;
