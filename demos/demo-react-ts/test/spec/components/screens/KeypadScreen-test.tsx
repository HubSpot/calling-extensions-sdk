import {
  fireEvent,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import KeypadScreen, {
  validateKeypadInput,
} from "../../../../src/components/screens/KeypadScreen";
import { ScreenNames } from "../../../../src/types/ScreenTypes";
import { renderWithContext } from "../../../render";

const noop = (..._args: any[]) => {};

const cti = {
  userLoggedOut: noop,
  outgoingCall: noop,
};

const props = {
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

describe("KeypadScreen", () => {
  beforeEach(() => {
    cti.userLoggedOut = jasmine.createSpy("userLoggedOut");
    cti.outgoingCall = jasmine.createSpy("outgoingCall");
    props.handleNextScreen = jasmine.createSpy("handleNextScreen");
    props.handleNavigateToScreen = jasmine.createSpy("handleNavigateToScreen");
    props.setDialNumber = jasmine.createSpy("setDialNumber");
  });

  it("Shows initial dial number", () => {
    renderWithContext(<KeypadScreen {...props} dialNumber={"617000000"} />);
    const input = screen.getByTestId("VizExInput-Input");
    expect((input as HTMLInputElement).value).toEqual("617000000");
  });

  it("Sets initial dial number to be HubSpot phone number", () => {
    renderWithContext(<KeypadScreen {...props} phoneNumber={"+1617000000"} />);
    expect(props.setDialNumber).toHaveBeenCalledWith("+1617000000");
  });

  describe("Log out", () => {
    it("Handles log out button click", () => {
      const { getByRole } = renderWithContext(<KeypadScreen {...props} />);
      const button = getByRole("button", {
        name: /Log out/i,
      });

      button.click();

      expect(cti.userLoggedOut).toHaveBeenCalled();
      expect(props.handleNavigateToScreen).toHaveBeenCalledWith(
        ScreenNames.Login
      );
    });
  });

  describe("Start call", () => {
    it("Button is disabled initially", () => {
      const { getByRole } = renderWithContext(<KeypadScreen {...props} />);
      const button = getByRole("button", {
        name: /start-call/i,
      });
      expect(button).toHaveAttribute("disabled");
    });

    it("Handles start call button click", () => {
      const { getByRole, getByTestId } = renderWithContext(
        <KeypadScreen {...props} />
      );

      const input = getByTestId("VizExInput-Input");
      fireEvent.change(input, {
        target: { value: "+16179341958" },
      });

      const button = getByRole("button", {
        name: /start-call/i,
      });
      button.click();
      expect(cti.outgoingCall).toHaveBeenCalled();
      expect(props.handleNextScreen).toHaveBeenCalled();
    });
  });

  describe("Number validation", () => {
    it("Validates keypad characters", () => {
      expect(validateKeypadInput("a")).toBe(false);
      expect(validateKeypadInput("(617)-934-1958")).toBe(false);
      expect(validateKeypadInput("+16179341958")).toBe(true);
      expect(validateKeypadInput("*+")).toBe(true);
    });

    it("Allows keypad characters in input field", async () => {
      const { getByTestId } = renderWithContext(<KeypadScreen {...props} />);

      const input = await getByTestId("VizExInput-Input");

      fireEvent.change(input, {
        target: { value: "617" },
      });

      expect(props.setDialNumber).toHaveBeenCalledWith("617");
    });

    it("Does not allow non keypad characters in input field", async () => {
      const { getByTestId } = renderWithContext(<KeypadScreen {...props} />);

      const input = await getByTestId("VizExInput-Input");
      fireEvent.change(input, {
        target: { value: "-" },
      });

      expect(props.setDialNumber).not.toHaveBeenCalled();
    });

    it("Handles backspace", () => {
      const { getByRole } = renderWithContext(
        <KeypadScreen {...props} dialNumber={"617"} />
      );
      const button = getByRole("button", {
        name: /backspace/i,
      });
      button.click();
      expect(props.setDialNumber).toHaveBeenCalledWith("61");
    });
  });

  describe("From Number", () => {
    it("Shows default from number", () => {
      const { getByText } = renderWithContext(<KeypadScreen {...props} />);

      expect(getByText(/\+1 617-948-3986/)).toBeInTheDocument();
    });

    it("Shows from numbers dropdown when clicked", async () => {
      const { getByRole, getByLabelText } = renderWithContext(
        <KeypadScreen {...props} />
      );
      expect(getByLabelText(/from-number-close/)).toBeInTheDocument();
      const button = getByRole("button", {
        name: /from-number/i,
      });
      button.click();

      await waitForElementToBeRemoved(() =>
        getByLabelText(/from-number-close/)
      );
      expect(getByLabelText(/from-number-open/)).toBeInTheDocument();
    });

    it("Hides numbers dropdown when clicked again", async () => {
      const { getByRole, findByLabelText, getByLabelText } = renderWithContext(
        <KeypadScreen {...props} />
      );
      const button = getByRole("button", {
        name: /from-number/i,
      });
      button.click();
      expect(await findByLabelText(/from-number-open/)).toBeInTheDocument();
      button.click();
      await waitForElementToBeRemoved(() => getByLabelText(/from-number-open/));
      expect(getByLabelText(/from-number-close/)).toBeInTheDocument();
    });
  });
});
