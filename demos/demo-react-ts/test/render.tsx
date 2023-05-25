import { ReactElement } from "react";
import { render } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import { createTheme } from "../src/visitor-ui-component-library/theme/createTheme";

export function renderWithContext(component: ReactElement, options?: any) {
  const Wrapper = ({ children }: { children: ReactElement }) => (
    <ThemeProvider theme={createTheme()}>{children}</ThemeProvider>
  );

  return render(component, { wrapper: Wrapper, ...options });
}
