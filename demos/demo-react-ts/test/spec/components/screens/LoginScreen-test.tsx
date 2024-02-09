import { fireEvent } from "@testing-library/react";
import LoginScreen from "../../../../src/components/screens/LoginScreen";
import { renderWithContext } from "../../../render";
import { ScreenProps } from "../../../../src/types/ScreenTypes";

const noop = (..._args: any[]) => {};

const cti = {
  userLoggedIn: noop,
};

const props: Partial<ScreenProps> = {
  handleNextScreen: noop,
  handlePreviousScreen: noop,
  handleNavigateToScreen: noop,
  cti,
  phoneNumber: "",
  engagementId: null,
  dialNumber: "",
  setDialNumber: noop,
  notes: "",
  setNotes: noop,
  callDuration: 0,
  callDurationString: "",
  startTimer: noop,
  stopTimer: noop,
  handleEndCall: noop,
  handleSaveCall: noop,
  fromNumber: "",
  setFromNumber: noop,
};

describe("LoginScreen", () => {
  beforeEach(() => {
    cti.userLoggedIn = jasmine.createSpy("userLoggedIn");
    props.handleNextScreen = jasmine.createSpy("handleNextScreen");
  });

  it("Handles log in button click", () => {
    const { getByRole } = renderWithContext(<LoginScreen {...props} />);
    const button = getByRole("button", {
      name: /Log in/i,
    });

    fireEvent.click(button);

    expect(cti.userLoggedIn).toHaveBeenCalled();
    expect(props.handleNextScreen).toHaveBeenCalled();
  });

  it("Handles sign in button click", () => {
    const { getByRole } = renderWithContext(<LoginScreen {...props} />);
    const button = getByRole("button", {
      name: /Sign in with SSO/i,
    });

    fireEvent.click(button);

    expect(cti.userLoggedIn).toHaveBeenCalled();
    expect(props.handleNextScreen).toHaveBeenCalled();
  });
});
