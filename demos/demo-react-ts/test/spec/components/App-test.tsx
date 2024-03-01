import {
  screen,
  waitForElementToBeRemoved,
  MatcherFunction,
} from "@testing-library/react";
import App from "../../../src/components/App";
import { renderWithContext } from "../../render";

type Query = (f: MatcherFunction) => HTMLElement;

const withMarkup =
  (query: Query) =>
  (text: string): HTMLElement =>
    query((content: string, node: HTMLElement) => {
      const hasText = (node: HTMLElement) => node.textContent === text;
      const childrenDontHaveText = Array.from(node.children).every(
        (child) => !hasText(child as HTMLElement)
      );
      return hasText(node) && childrenDontHaveText;
    });

describe("App", () => {
  it("Shows login screen", () => {
    renderWithContext(<App />);
    expect(
      screen.getByText(/Log into your calling account/)
    ).toBeInTheDocument();
  });

  it("Shows alert", () => {
    const { getByText } = renderWithContext(<App />);
    const getByTextWithMarkup = withMarkup(getByText);
    expect(
      getByTextWithMarkup(
        "Open your console to see the incoming (beta) and outgoing messages with HubSpot."
      )
    ).toBeInTheDocument();
  });

  it("Hides alert when confirm button is clicked", async () => {
    const { getByText } = renderWithContext(<App />);
    const getByTextWithMarkup = withMarkup(getByText);
    const confirmAlertButton = screen.getByRole("button", { name: /×/i });
    confirmAlertButton.click();

    await waitForElementToBeRemoved(() =>
      getByTextWithMarkup(
        "Open your console to see the incoming (beta) and outgoing messages with HubSpot."
      )
    );
  });
});
