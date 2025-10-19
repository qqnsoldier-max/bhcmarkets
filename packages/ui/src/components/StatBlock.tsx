import styled from "styled-components";

const Wrapper = styled.article`
  display: grid;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.md};
  background: linear-gradient(180deg, rgba(17, 23, 42, 0.85), rgba(17, 23, 42, 0.6));
  border: 1px solid rgba(63, 140, 255, 0.18);
  box-shadow: ${({ theme }) => theme.shadows.soft};
  min-width: 180px;
`;

const Label = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

const ValueRow = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Value = styled.span`
  font-size: ${({ theme }) => theme.typography.sizes.xxl};
  font-weight: ${({ theme }) => theme.typography.weightBold};
  letter-spacing: -0.02em;
`;

const Trend = styled.span<{ $direction: "up" | "down" }>`
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ theme }) => theme.typography.weightMedium};
  color: ${({ theme, $direction }) =>
    $direction === "up" ? theme.colors.status.success : theme.colors.status.danger};
`;

const Meta = styled.span`
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  color: ${({ theme }) => theme.colors.text.muted};
`;

export interface StatBlockProps {
  label: string;
  value: string;
  trend?: string;
  trendDirection?: "up" | "down";
  meta?: string;
}

export const StatBlock = ({ label, value, trend, trendDirection = "up", meta }: StatBlockProps) => (
  <Wrapper>
    <Label>{label}</Label>
    <ValueRow>
      <Value>{value}</Value>
      {trend && <Trend $direction={trendDirection}>{trend}</Trend>}
    </ValueRow>
    {meta && <Meta>{meta}</Meta>}
  </Wrapper>
);

export default StatBlock;
