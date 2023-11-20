import CallEndedScreen from "../../../../src/components/screens/CallEndedScreen";
import IncomingScreen from "../../../../src/components/screens/IncomingScreen";
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
  toNumber: "",
  setToNumber: noop,
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
  direction: "INBOUND",
  incomingContactName: "",
  incomingNumber: "+123456789",
  callStatus: {
    INTERNAL_COMPLETED: "COMPLETED",
  },
};

describe("IncomingScreen", () => {
  beforeEach(() => {
    props.handleEndCall = jasmine.createSpy("handleEndCall");
    cti.callEnded = jasmine.createSpy("callEnded");
    props.handleNextScreen = jasmine.createSpy("handleNextScreen");
    props.startTimer = jasmine.createSpy("startTimer");
    cti.callAnswered = jasmine.createSpy("callAnswered");
  });

  it("Shows call ended text - no contact match", () => {
    const { getByText } = renderWithContext(
      <IncomingScreen {...props} incomingNumber="+123456789" />
    );
    expect(getByText(/Incoming call.../)).toBeInTheDocument();
    expect(getByText(/\+123456789/)).toBeInTheDocument();
  });

  it("Shows call ended text - contact match", () => {
    const { getByText } = renderWithContext(
      <IncomingScreen
        {...props}
        incomingNumber="+123456789"
        incomingContactName="Michael Scott"
      />
    );
    expect(getByText(/Incoming call.../)).toBeInTheDocument();
    expect(getByText(/Michael Scott/)).toBeInTheDocument();
    expect(getByText(/\+123456789/)).toBeInTheDocument();
  });

  it("Shows call ended text - contact match - company", () => {
    const { getByText } = renderWithContext(
      <IncomingScreen
        {...props}
        incomingNumber="+123456789"
        incomingContactName="ABC Ltd"
      />
    );
    expect(getByText(/Incoming call.../)).toBeInTheDocument();
    expect(getByText(/ABC Ltd/)).toBeInTheDocument();
    expect(getByText(/\+123456789/)).toBeInTheDocument();
  });

  it("Receives call", () => {
    const { getByRole } = renderWithContext(<IncomingScreen {...props} />);
    const button = getByRole("button", { name: /start-call/ });
    button.click();
    expect(props.handleNextScreen).toHaveBeenCalled();
    expect(props.startTimer).toHaveBeenCalled();
    expect(cti.callAnswered).toHaveBeenCalled();
  });

  it("Ends call", () => {
    const { getByRole } = renderWithContext(<IncomingScreen {...props} />);
    const button = getByRole("button", { name: /end-call/ });
    button.click();
    expect(props.handleEndCall).toHaveBeenCalled();
    expect(cti.callEnded).toHaveBeenCalledWith({
      callEndStatus: "COMPLETED",
    });
  });
});
