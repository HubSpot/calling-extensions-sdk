import { fireEvent, screen } from "@testing-library/react";
import DialingScreen from "../../../../src/components/screens/DialingScreen";
import { ScreenNames } from "../../../../src/types/ScreenTypes";
import { renderWithWrapper } from "../../../render";

const noop = (..._args: any[]) => {};

const cti = {
  callAnswered: noop,
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

describe("DialingScreen", () => {
  beforeEach(() => {
    jasmine.clock().install();
    cti.callAnswered = jasmine.createSpy("callAnswered");
    props.handleNextScreen = jasmine.createSpy("handleNextScreen");
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });
  it("Show dialing text", () => {
    renderWithWrapper(<DialingScreen {...props} />);
    expect(screen.getByText(/Dialing/)).toBeInTheDocument();
  });

  it("Sends callAnswered message", () => {
    renderWithWrapper(<DialingScreen {...props} />);
    jasmine.clock().tick(3000);
    expect(cti.callAnswered).toHaveBeenCalled();
  });

  it("Navigates to next screen", () => {
    renderWithWrapper(<DialingScreen {...props} />);
    jasmine.clock().tick(3000);
    expect(props.handleNextScreen).toHaveBeenCalled();
  });
});
