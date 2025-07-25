import CallEndedScreen from "../../../../src/components/screens/CallEndedScreen";
import { ScreenProps } from "../../../../src/types/ScreenTypes";
import { renderWithContext } from "../../../render";

const noop = (..._args: any[]) => {};

const cti = {
  callCompleted: noop,
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
  handleCallEnded: noop,
  handleCallCompleted: noop,
  fromNumber: "",
  setFromNumber: noop,
  direction: "OUTBOUND",
};

describe("CallEndedScreen", () => {
  beforeEach(() => {
    props.handleCallCompleted = jasmine.createSpy("handleCallCompleted");
    cti.callCompleted = jasmine.createSpy("callCompleted");
    cti.finalizeEngagement = jasmine.createSpy("finalizeEngagement");
  });

  it("Shows call ended text", () => {
    const { getByText } = renderWithContext(
      <CallEndedScreen {...props} dialNumber="+123" />
    );
    expect(getByText(/Call with \+123/)).toBeInTheDocument();
  });

  it("Shows notes", () => {
    const { getByText } = renderWithContext(
      <CallEndedScreen {...props} notes="calling notes" />
    );
    expect(getByText(/calling notes/)).toBeInTheDocument();
  });

  it("Saves call - no recording", () => {
    const { getByRole } = renderWithContext(
      <CallEndedScreen
        {...props}
        engagementId={1}
        notes="calling notes"
        callDuration={3000}
      />
    );
    const button = getByRole("button", { name: /save-call/ });
    button.click();
    expect(props.handleCallCompleted).toHaveBeenCalled();
    expect(cti.callCompleted).toHaveBeenCalledWith({
      engagementId: 1,
      hideWidget: false,
      engagementProperties: {
        hs_call_body: "calling notes",
        hs_call_duration: "3000",
        hs_call_status: "COMPLETED",
        hs_call_recording_url: null,
      },
    });
  });

  it("Saves call - with recording", () => {
    const { getByRole } = renderWithContext(
      <CallEndedScreen
        {...props}
        engagementId={1}
        notes="calling notes"
        callDuration={3000}
        isCallRecorded
      />
    );
    const button = getByRole("button", { name: /save-call/ });
    button.click();
    expect(props.handleCallCompleted).toHaveBeenCalled();
    expect(cti.callCompleted).toHaveBeenCalledWith({
      engagementId: 1,
      hideWidget: false,
      engagementProperties: {
        hs_call_body: "calling notes",
        hs_call_duration: "3000",
        hs_call_status: "COMPLETED",
        hs_call_recording_url:
          "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      },
    });
  });

  it("Saves canceled call", () => {
    const { getByRole } = renderWithContext(
      <CallEndedScreen
        {...props}
        engagementId={1}
        notes="calling notes"
        callDuration={3000}
        callStatus="CANCELED"
      />
    );
    const button = getByRole("button", { name: /save-call/ });
    button.click();
    expect(props.handleCallCompleted).toHaveBeenCalled();
    expect(
      (cti.callCompleted as jasmine.Spy).calls.argsFor(0)[0]
        .engagementProperties.hs_call_status
    ).toEqual("CANCELED");
  });

  it("Finalizes engagement", () => {
    const { getByRole } = renderWithContext(
      <CallEndedScreen
        {...props}
        engagementId={1}
        notes="calling notes"
        callDuration={3000}
      />
    );
    const button = getByRole("button", { name: /finalize-engagement/ });
    button.click();
    expect(cti.finalizeEngagement).toHaveBeenCalledWith({
      engagementId: 1,
    });
  });
});
