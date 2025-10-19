import styled from "styled-components";
import {
  Badge,
  Button,
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

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.sizes.xl};
`;

const Meta = styled.p`
  color: ${({ theme }) => theme.colors.text.tertiary};
  font-size: ${({ theme }) => theme.typography.sizes.base};
`;

const Grid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
`;

const PlaceholderList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const PlaceholderRow = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.sm} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.subtle};
  &:last-of-type {
    border-bottom: none;
  }
`;

const Label = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const OrdersPage = (): JSX.Element => (
  <Page>
    <Header>
      <div>
        <Title>Orders</Title>
        <Meta>Monitor recent tickets and queued instructions.</Meta>
      </div>
      <Button variant="outline" size="sm">
        Export CSV
      </Button>
    </Header>

    <Grid>
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <Badge variant="default">Placeholder</Badge>
        </CardHeader>
        <CardBody>
          <PlaceholderList>
            <PlaceholderRow>
              <Label>BHV / Buy 2,000 @ 58.20</Label>
              <Badge variant="success">Filled</Badge>
            </PlaceholderRow>
            <PlaceholderRow>
              <Label>ALPHA / Sell 400 @ 112.40</Label>
              <Badge variant="warning">Partial</Badge>
            </PlaceholderRow>
            <PlaceholderRow>
              <Label>XBT / Buy 1.5 @ 26,200</Label>
              <Badge variant="danger">Rejected</Badge>
            </PlaceholderRow>
          </PlaceholderList>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Workflow Integrations</CardTitle>
          <CardSubtitle>OMS, EMS, and alerts</CardSubtitle>
        </CardHeader>
        <CardBody>
          <Label>Hook into upstream order routers once APIs become available.</Label>
        </CardBody>
      </Card>
    </Grid>
  </Page>
);

export default OrdersPage;
