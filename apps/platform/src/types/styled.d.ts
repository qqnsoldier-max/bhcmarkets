import "styled-components";
import type { TokenTheme } from "@repo/ui";

declare module "styled-components" {
  export interface DefaultTheme extends TokenTheme {}
}
