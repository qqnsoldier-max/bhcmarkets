import styled from "styled-components";

export const Card = styled.section`
	background: radial-gradient(circle at top, rgba(63, 140, 255, 0.1), transparent 55%),
		${({ theme }) => theme.colors.backgrounds.elevated};
	border-radius: ${({ theme }) => theme.radii.lg};
	border: 1px solid ${({ theme }) => theme.colors.border.subtle};
	padding: ${({ theme }) => theme.spacing.lg};
	box-shadow: ${({ theme }) => theme.shadows.soft};
	color: ${({ theme }) => theme.colors.text.primary};
	font-family: ${({ theme }) => theme.typography.fontFamily};
`;

export const CardHeader = styled.header`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: ${({ theme }) => theme.spacing.md};
	margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const CardTitle = styled.h3`
	font-size: ${({ theme }) => theme.typography.sizes.lg};
	font-weight: ${({ theme }) => theme.typography.weightSemiBold};
	margin: 0;
`;

export const CardSubtitle = styled.p`
	margin: 4px 0 0;
	color: ${({ theme }) => theme.colors.text.tertiary};
	font-size: ${({ theme }) => theme.typography.sizes.sm};
`;

export const CardBody = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${({ theme }) => theme.spacing.md};
`;

export default Card;
