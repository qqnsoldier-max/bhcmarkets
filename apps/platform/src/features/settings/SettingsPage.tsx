import { useState } from "react";
import styled from "styled-components";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardSubtitle,
  CardTitle,
  Divider,
  Toggle,
} from "@repo/ui";

const Page = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const HeaderContent = styled.div`
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
  padding: ${({ theme }) => theme.spacing.md} 0;

  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.colors.border.subtle};
  }
`;

const SettingLabel = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xxs};
`;

const SettingTitle = styled.span`
  font-weight: ${({ theme }) => theme.typography.weightMedium};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const SettingDescription = styled.span`
  color: ${({ theme }) => theme.colors.text.tertiary};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const SettingsPage = (): JSX.Element => {
  const [desktopAlerts, setDesktopAlerts] = useState(true);
  const [dailyDigest, setDailyDigest] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [tradingNotifications, setTradingNotifications] = useState(true);

  return (
    <Page>
      <Header>
        <HeaderContent>
          <Title>Settings</Title>
          <Subtitle>Manage your account preferences and platform configuration</Subtitle>
        </HeaderContent>
        <Button variant="primary">Save Changes</Button>
      </Header>

      <Grid>
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Account & Security</CardTitle>
              <CardSubtitle>Manage your account security settings</CardSubtitle>
            </div>
          </CardHeader>
          <CardBody>
            <SettingRow>
              <SettingLabel>
                <SettingTitle>Two-Factor Authentication</SettingTitle>
                <SettingDescription>Add an extra layer of security to your account</SettingDescription>
              </SettingLabel>
              <Toggle
                checked={twoFactorAuth}
                onChange={(e) => setTwoFactorAuth(e.target.checked)}
                aria-label="Two-Factor Authentication"
              />
            </SettingRow>
            <SettingRow>
              <SettingLabel>
                <SettingTitle>Password</SettingTitle>
                <SettingDescription>Last changed 30 days ago</SettingDescription>
              </SettingLabel>
              <Button variant="outline" size="sm">Change Password</Button>
            </SettingRow>
            <SettingRow>
              <SettingLabel>
                <SettingTitle>API Keys</SettingTitle>
                <SettingDescription>Manage your API access tokens</SettingDescription>
              </SettingLabel>
              <Button variant="outline" size="sm">Manage Keys</Button>
            </SettingRow>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Notifications</CardTitle>
              <CardSubtitle>Configure your notification preferences</CardSubtitle>
            </div>
            <Badge variant="accent">Live</Badge>
          </CardHeader>
          <CardBody>
            <SettingRow>
              <SettingLabel>
                <SettingTitle>Desktop Alerts</SettingTitle>
                <SettingDescription>Show toast notifications for fills and risk breaches</SettingDescription>
              </SettingLabel>
              <Toggle
                checked={desktopAlerts}
                onChange={(e) => setDesktopAlerts(e.target.checked)}
                aria-label="Desktop alerts"
              />
            </SettingRow>
            <SettingRow>
              <SettingLabel>
                <SettingTitle>Trading Notifications</SettingTitle>
                <SettingDescription>Get notified about order executions and updates</SettingDescription>
              </SettingLabel>
              <Toggle
                checked={tradingNotifications}
                onChange={(e) => setTradingNotifications(e.target.checked)}
                aria-label="Trading notifications"
              />
            </SettingRow>
            <SettingRow>
              <SettingLabel>
                <SettingTitle>Daily Digest</SettingTitle>
                <SettingDescription>Receive email summary of P&L and exposures</SettingDescription>
              </SettingLabel>
              <Toggle
                checked={dailyDigest}
                onChange={(e) => setDailyDigest(e.target.checked)}
                aria-label="Daily digest"
              />
            </SettingRow>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Trading Preferences</CardTitle>
              <CardSubtitle>Customize your trading experience</CardSubtitle>
            </div>
          </CardHeader>
          <CardBody>
            <SettingRow>
              <SettingLabel>
                <SettingTitle>Default Order Type</SettingTitle>
                <SettingDescription>Market, Limit, or Stop orders</SettingDescription>
              </SettingLabel>
              <Button variant="outline" size="sm">Configure</Button>
            </SettingRow>
            <SettingRow>
              <SettingLabel>
                <SettingTitle>Confirm on Submit</SettingTitle>
                <SettingDescription>Require confirmation before placing orders</SettingDescription>
              </SettingLabel>
              <Toggle checked readOnly aria-label="Confirm on submit enabled" />
            </SettingRow>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Display & Theme</CardTitle>
          </CardHeader>
          <CardBody>
            <SettingRow>
              <SettingLabel>
                <SettingTitle>Theme Mode</SettingTitle>
                <SettingDescription>Currently using dark theme</SettingDescription>
              </SettingLabel>
              <ButtonGroup>
                <Button variant="outline" size="sm">Light</Button>
                <Button variant="secondary" size="sm">Dark</Button>
              </ButtonGroup>
            </SettingRow>
            <SettingRow>
              <SettingLabel>
                <SettingTitle>Compact Mode</SettingTitle>
                <SettingDescription>Reduce spacing for more information density</SettingDescription>
              </SettingLabel>
              <Toggle checked={false} readOnly aria-label="Compact mode disabled" />
            </SettingRow>
          </CardBody>
        </Card>
      </Grid>
    </Page>
  );
};

export default SettingsPage;
