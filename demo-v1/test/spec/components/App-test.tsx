import { screen, waitForElementToBeRemoved } from "@testing-library/react";
import App from "../../../src/components/App";
import { renderWithWrapper } from "../../render";

describe("App", () => {
  it("Shows login screen", () => {
    renderWithWrapper(<App />);
    expect(
      screen.getByText("Log into your calling account")
    ).toBeInTheDocument();
  });

  it("Shows alert", () => {
    renderWithWrapper(<App />);
    expect(
      screen.getByText(
        /Open your console to see the incoming and outgoing messages with HubSpot./i
      )
    ).toBeInTheDocument();
  });

  it("Hides alert when confirm button is clicked", async () => {
    renderWithWrapper(<App />);
    const confirmAlertButton = screen.getByRole("button", { name: /×/i });
    confirmAlertButton.click();

    await waitForElementToBeRemoved(() =>
      screen.getByText(
        /Open your console to see the incoming and outgoing messages with HubSpot./i
      )
    );
    expect(
      screen.queryByText(
        /Open your console to see the incoming and outgoing messages with HubSpot./i
      )
    ).not.toBeInTheDocument();
  });
});
