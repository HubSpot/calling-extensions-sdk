import { screen, waitForElementToBeRemoved } from "@testing-library/react";
import App from "../../../src/components/App";
import { renderWithContext } from "../../render";

describe("App", () => {
  it("Shows login screen", () => {
    renderWithContext(<App />);
    expect(
      screen.getByText(/Log into your calling account/)
    ).toBeInTheDocument();
  });

  it("Shows alert", () => {
    renderWithContext(<App />);
    expect(
      screen.getByText(
        /Open your console to see the incoming and outgoing messages with HubSpot./
      )
    ).toBeInTheDocument();
  });

  it("Hides alert when confirm button is clicked", async () => {
    renderWithContext(<App />);
    const confirmAlertButton = screen.getByRole("button", { name: /×/i });
    confirmAlertButton.click();

    await waitForElementToBeRemoved(() =>
      screen.getByText(
        /Open your console to see the incoming and outgoing messages with HubSpot./
      )
    );
    expect(
      screen.queryByText(
        /Open your console to see the incoming and outgoing messages with HubSpot./
      )
    ).not.toBeInTheDocument();
  });
});
