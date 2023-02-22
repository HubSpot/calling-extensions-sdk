import { fireEvent } from "@testing-library/react";
import LoginScreen from "../../../../src/components/screens/LoginScreen";
import { renderWithWrapper } from "../../../render";

const noop = () => {};

const cti = {
  userLoggedIn: noop,
};

const props = {
  handleNextScreen: noop,
  handlePreviousScreen: noop,
  handleNavigateToScreen: noop,
  cti,
  phoneNumber: "",
  engagementId: "",
  dialNumber: "",
  setDialNumber: noop,
  notes: "",
  setNotes: noop,
  callDurationString: "",
  startTimer: noop,
  stopTimer: noop,
  handleEndCall: noop,
  handleSaveCall: noop,
};

beforeEach(() => {
  cti.userLoggedIn = jasmine.createSpy("userLoggedIn");
  props.handleNextScreen = jasmine.createSpy("handleNextScreen");
});

describe("Log in", () => {
  it("Handles log in button click", () => {
    const { getByRole } = renderWithWrapper(<LoginScreen {...props} />);
    const button = getByRole("button", {
      name: /Log in/i,
    });

    fireEvent.click(button);

    expect(cti.userLoggedIn).toHaveBeenCalled();
    expect(props.handleNextScreen).toHaveBeenCalled();
  });

  it("Handles sign in button click", () => {
    const { getByRole } = renderWithWrapper(<LoginScreen {...props} />);
    const button = getByRole("button", {
      name: /Sign in with SSO/i,
    });

    fireEvent.click(button);

    expect(cti.userLoggedIn).toHaveBeenCalled();
    expect(props.handleNextScreen).toHaveBeenCalled();
  });
});
