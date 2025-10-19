import styled from "styled-components";
import {
  Badge,
  Card,
  CardBody,
  CardHeader,
  CardSubtitle,
  CardTitle,
  Toggle,
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
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
`;

const SettingRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const SettingLabel = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xxs};
`;

const SettingTitle = styled.span`
  font-weight: ${({ theme }) => theme.typography.weightMedium};
`;

const SettingDescription = styled.span`
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

export const SettingsPage = (): JSX.Element => (
  <Page>
    <Header>
      <Title>Settings</Title>
      <Subtitle>Control preferences and platform-level flags.</Subtitle>
    </Header>

    <Grid>
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Notifications</CardTitle>
            <CardSubtitle>Realtime alerts and briefings</CardSubtitle>
          </div>
          <Badge variant="accent">Beta</Badge>
        </CardHeader>
        <CardBody>
          <SettingRow>
            <SettingLabel>
              <SettingTitle>Desktop alerts</SettingTitle>
              <SettingDescription>Pops toast notifications for fills and risk breaches.</SettingDescription>
            </SettingLabel>
            <Toggle checked readOnly aria-label="Desktop alerts enabled" />
          </SettingRow>
          <SettingRow>
            <SettingLabel>
              <SettingTitle>Daily digest</SettingTitle>
              <SettingDescription>Email summary of PnL and exposures.</SettingDescription>
            </SettingLabel>
            <Toggle checked={false} readOnly aria-label="Daily digest disabled" />
          </SettingRow>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Workspace</CardTitle>
        </CardHeader>
        <CardBody>
          <SettingLabel>
            <SettingTitle>Theme overrides</SettingTitle>
            <SettingDescription>
              Hook up advanced theming controls from the design token panel.
            </SettingDescription>
          </SettingLabel>
        </CardBody>
      </Card>
    </Grid>
  </Page>
);

export default SettingsPage;
