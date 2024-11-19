import CallingScreen from "../../../../src/components/screens/CallingScreen";
import { ScreenProps } from "../../../../src/types/ScreenTypes";
import { renderWithContext } from "../../../render";

const noop = (..._args: any[]) => {};

const cti = {
  callEnded: noop,
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
  handleSaveCall: noop,
  fromNumber: "",
  setFromNumber: noop,
  callStatus: "COMPLETED",
};

describe("CallingScreen", () => {
  beforeEach(() => {
    props.handleCallEnded = jasmine.createSpy("handleCallEnded");
    cti.callEnded = jasmine.createSpy("callEnded");
  });

  it("Ends call", () => {
    const { getByRole } = renderWithContext(<CallingScreen {...props} />);
    const button = getByRole("button", { name: /end-call/ });
    button.click();
    expect(props.handleCallEnded).toHaveBeenCalled();
    expect(cti.callEnded).toHaveBeenCalledWith({
      callEndStatus: "COMPLETED",
    });
  });
});
