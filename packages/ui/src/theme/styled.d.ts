import "styled-components";
import type { TokenTheme } from "./tokens";

declare module "styled-components" {
  // Augment the DefaultTheme interface with our design tokens.
  export interface DefaultTheme extends TokenTheme {}
}
