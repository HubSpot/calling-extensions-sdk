import CallEndedScreen from "../../../../src/components/screens/CallEndedScreen";
import { renderWithWrapper } from "../../../render";

const noop = (..._args: any[]) => {};

const cti = {
  callCompleted: noop,
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
};

describe("CallEndedScreen", () => {
  beforeEach(() => {
    props.handleSaveCall = jasmine.createSpy("handleSaveCall");
    cti.callCompleted = jasmine.createSpy("callCompleted");
  });

  it("Shows call ended text", () => {
    const { getByText } = renderWithWrapper(
      <CallEndedScreen {...props} dialNumber="+123" />
    );
    expect(getByText(/Call with \+123/)).toBeInTheDocument();
  });

  it("Shows notes", () => {
    const { getByText } = renderWithWrapper(
      <CallEndedScreen {...props} notes="calling notes" />
    );
    expect(getByText(/calling notes/)).toBeInTheDocument();
  });

  it("Saves call", () => {
    const { getByRole } = renderWithWrapper(
      <CallEndedScreen
        {...props}
        engagementId={1}
        notes="calling notes"
        callDuration={3000}
      />
    );
    const button = getByRole("button", { name: /save-call/ });
    button.click();
    expect(props.handleSaveCall).toHaveBeenCalled();
    expect(cti.callCompleted).toHaveBeenCalledWith({
      engagementId: 1,
      hideWidget: false,
      notes: "calling notes",
      callDuration: 3000,
    });
  });
});
