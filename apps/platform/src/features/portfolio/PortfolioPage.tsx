import styled from "styled-components";
import {
  Badge,
  Card,
  CardBody,
  CardHeader,
  CardSubtitle,
  CardTitle,
} from "@repo/ui";

const Page = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const PageHeader = styled.header`
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

const PlaceholderCopy = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

export const PortfolioPage = (): JSX.Element => (
  <Page>
    <PageHeader>
      <Title>Portfolio</Title>
      <Subtitle>Snapshot of allocations, exposures, and recent adjustments.</Subtitle>
    </PageHeader>

    <Grid>
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Allocation Mix</CardTitle>
            <CardSubtitle>Segment by asset class</CardSubtitle>
          </div>
          <Badge variant="accent">Coming soon</Badge>
        </CardHeader>
        <CardBody>
          <PlaceholderCopy>
            Wire charts or heatmaps here to visualise positions and hedges across desks.
          </PlaceholderCopy>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Risk Buckets</CardTitle>
            <CardSubtitle>VaR, beta, and drawdown bands</CardSubtitle>
          </div>
        </CardHeader>
        <CardBody>
          <PlaceholderCopy>
            Placeholder for risk telemetry once the data feed is wired into the layout.
          </PlaceholderCopy>
        </CardBody>
      </Card>
    </Grid>
  </Page>
);

export default PortfolioPage;
