import {
  fireEvent,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import KeypadScreen from "../../../../src/components/screens/KeypadScreen";
import { ScreenNames, ScreenProps } from "../../../../src/types/ScreenTypes";
import { renderWithContext } from "../../../render";
import { validateKeypadInput } from "../../../../src/utils/phoneNumberUtils";

const noop = (..._args: any[]) => {};

const cti = {
  userLoggedOut: noop,
  outgoingCall: noop,
  userAvailable: noop,
  userUnavailable: noop,
  incomingCall: noop,
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
  setDirection: noop,
  setIncomingNumber: noop,
  setAvailability: noop,
};

describe("KeypadScreen", () => {
  beforeEach(() => {
    cti.userLoggedOut = jasmine.createSpy("userLoggedOut");
    cti.outgoingCall = jasmine.createSpy("outgoingCall");
    props.handleNextScreen = jasmine.createSpy("handleNextScreen");
    props.handleNavigateToScreen = jasmine.createSpy("handleNavigateToScreen");
    props.setDialNumber = jasmine.createSpy("setDialNumber");
    props.setDirection = jasmine.createSpy("setDirection");
    cti.userAvailable = jasmine.createSpy("userAvailable");
    cti.userUnavailable = jasmine.createSpy("userUnavailable");
    props.setAvailability = jasmine.createSpy("setAvailability");
    props.setDirection = jasmine.createSpy("setDirection");
    cti.incomingCall = jasmine.createSpy("incomingCall");
    props.setIncomingNumber = jasmine.createSpy("setIncomingNumber");
  });

  it("Shows initial dial number", () => {
    renderWithContext(<KeypadScreen {...props} dialNumber="617000000" />);
    const input = screen.getByTestId("dial-number-input");
    expect((input as HTMLInputElement).value).toEqual("617000000");
  });

  it("Sets initial dial number to be HubSpot phone number", () => {
    renderWithContext(<KeypadScreen {...props} phoneNumber="+1617000000" />);
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

  describe("Availability Status", () => {
    it("Shows initial availability status", () => {
      const { getByLabelText } = renderWithContext(<KeypadScreen {...props} />);
      expect(getByLabelText("availability-toggle-button")).toHaveTextContent(
        "Unavailable"
      );
    });
    it("Shows status options when clicked", async () => {
      const { getByLabelText } = renderWithContext(<KeypadScreen {...props} />);
      expect(getByLabelText("available-option")).toBeInTheDocument();
      expect(getByLabelText("unavailable-option")).toBeInTheDocument();
      expect(
        await getByLabelText("trigger-incoming-call-close")
      ).toBeInTheDocument();
    });
    it("Changes status when status option clicked - unavailable to available", async () => {
      // ARRANGE
      const { getByRole, getByLabelText } = renderWithContext(
        <KeypadScreen {...props} />
      );
      const button = getByRole("button", {
        name: /availability-toggle-button/i,
      });
      button.click();
      await waitForElementToBeRemoved(() =>
        getByLabelText("availability-menu-close")
      );
      const availableBtn = getByRole("button", {
        name: "available-option",
      });

      // ACT
      availableBtn.click();

      //ASSERT
      expect(props.setAvailability).toHaveBeenCalledWith("AVAILABLE");
      expect(cti.userAvailable).toHaveBeenCalled();
    });

    it("Changes status when status option clicked - available to unavailable", async () => {
      // ARRANGE
      const { getByRole, getByLabelText } = renderWithContext(
        <KeypadScreen {...props} availability="AVAILABLE" />
      );
      const button = getByRole("button", {
        name: /availability-toggle-button/i,
      });
      button.click();
      await waitForElementToBeRemoved(() =>
        getByLabelText("availability-menu-close")
      );
      const unavailableBtn = getByRole("button", {
        name: "unavailable-option",
      });

      // ACT
      unavailableBtn.click();

      //ASSERT
      expect(props.setAvailability).toHaveBeenCalledWith("UNAVAILABLE");
      expect(cti.userUnavailable).toHaveBeenCalled();
    });

    it("set incoming number", async () => {
      // ARRANGE
      const { getByRole, getByLabelText, getByTestId } = renderWithContext(
        <KeypadScreen
          {...props}
          availability="AVAILABLE"
          fromNumber="123456789"
        />
      );
      const button = getByRole("button", {
        name: /availability-toggle-button/i,
      });
      button.click();
      await waitForElementToBeRemoved(() =>
        getByLabelText("availability-menu-close")
      );
      const triggerBtn = getByRole("button", {
        name: "trigger-incoming-call-option",
      });
      triggerBtn.click();
      await waitForElementToBeRemoved(() =>
        getByLabelText("trigger-incoming-call-close")
      );

      const input = await getByTestId("incoming-number-input");

      // ACT
      fireEvent.change(input, {
        target: { value: "6476251259" },
      });

      //ASSERT
      expect(props.setIncomingNumber).toHaveBeenCalledWith("6476251259");
    });

    it("triggers incoming call", async () => {
      // ARRANGE
      const { getByRole, getByLabelText, getByTestId } = renderWithContext(
        <KeypadScreen
          {...props}
          availability="AVAILABLE"
          fromNumber="123456789"
          incomingNumber="6476251259"
        />
      );

      const button = getByRole("button", {
        name: /availability-toggle-button/i,
      });
      button.click();
      await waitForElementToBeRemoved(() =>
        getByLabelText("availability-menu-close")
      );
      const triggerOptionBtn = getByRole("button", {
        name: "trigger-incoming-call-option",
      });
      triggerOptionBtn.click();
      await waitForElementToBeRemoved(() =>
        getByLabelText("trigger-incoming-call-close")
      );
      const triggerCallBtn = getByRole("button", {
        name: "trigger-incoming-call",
      });

      // ACT
      triggerCallBtn.click();

      // ASSERT
      expect(props.setDirection).toHaveBeenCalledWith("INBOUND");
      expect(cti.incomingCall).toHaveBeenCalledWith({
        createEngagement: true,
        fromNumber: "6476251259",
        toNumber: "123456789",
      });
      expect(props.handleNextScreen).toHaveBeenCalled();
    });
  });

  describe("Start call", () => {
    it("Button is disabled initially", () => {
      const { getByRole } = renderWithContext(<KeypadScreen {...props} />);
      const button = getByRole("button", {
        name: /outgoing-call/i,
      });
      expect(button).toHaveAttribute("disabled");
    });

    it("Handles start call button click", () => {
      const { getByRole, getByTestId } = renderWithContext(
        <KeypadScreen {...props} dialNumber="+1617" />
      );

      const input = getByTestId("dial-number-input");
      fireEvent.change(input, {
        target: { value: "+16179341958" },
      });

      const button = getByRole("button", {
        name: /outgoing-call/i,
      });
      button.click();

      expect(cti.outgoingCall).toHaveBeenCalledWith({
        createEngagement: true,
        phoneNumber: "+1617",
        callStartTime: jasmine.anything(),
      });
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

      const input = await getByTestId("dial-number-input");

      fireEvent.change(input, {
        target: { value: "617" },
      });

      expect(props.setDialNumber).toHaveBeenCalledWith("617");
    });

    it("Does not allow non keypad characters in input field", async () => {
      const { getByTestId } = renderWithContext(<KeypadScreen {...props} />);

      const input = await getByTestId("dial-number-input");
      fireEvent.change(input, {
        target: { value: "-" },
      });

      expect(props.setDialNumber).not.toHaveBeenCalled();
    });

    it("Handles backspace", () => {
      const { getByRole } = renderWithContext(
        <KeypadScreen {...props} dialNumber="617" />
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
