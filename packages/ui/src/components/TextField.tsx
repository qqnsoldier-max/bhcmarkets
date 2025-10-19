import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import styled, { css } from "styled-components";

export interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode;
  helperText?: ReactNode;
  error?: boolean;
}

const Wrapper = styled.label`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-family: ${({ theme }) => theme.typography.fontFamily};
`;

const LabelRow = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ theme }) => theme.typography.weightMedium};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

const InputBase = styled.input<{ $hasError: boolean }>`
  background: rgba(12, 18, 38, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: ${({ theme }) => theme.radii.md};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  font-size: ${({ theme }) => theme.typography.sizes.base};
  color: ${({ theme }) => theme.colors.text.primary};
  transition: ${({ theme }) => theme.transitions.base};
  outline: none;

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.muted};
  }

  &:focus {
    border-color: rgba(63, 140, 255, 0.6);
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.focus};
  }

  ${({ $hasError }) =>
    $hasError &&
    css`
      border-color: rgba(255, 90, 95, 0.6);
      box-shadow: 0 0 0 3px rgba(255, 90, 95, 0.16);
    `}
`;

const Helper = styled.span<{ $type: "error" | "info" }>`
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  color: ${({ theme, $type }) => ($type === "error" ? theme.colors.status.danger : theme.colors.text.muted)};
`;

const ErrorLabel = styled.span`
  color: ${({ theme }) => theme.colors.status.danger};
`;

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, helperText, error = false, id, required, type = "text", ...props }, ref) => (
    <Wrapper htmlFor={id}>
      {(label || required) && (
        <LabelRow>
          <span>
            {label}
            {required ? " *" : ""}
          </span>
          {error && <ErrorLabel>Error</ErrorLabel>}
        </LabelRow>
      )}
      <InputBase ref={ref} id={id} type={type} $hasError={error} required={required} {...props} />
      {helperText && <Helper $type={error ? "error" : "info"}>{helperText}</Helper>}
    </Wrapper>
  )
);

TextField.displayName = "TextField";

export default TextField;
