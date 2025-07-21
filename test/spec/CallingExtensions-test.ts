import CallingExtensions from "../../src/CallingExtensions";
import { messageType } from "../../src/Constants";
import {
  OnCallCompleted,
  OnIncomingCall,
  OnInitialized,
  OnOutgoingCall,
} from "../../src/types";

const noop = () => {};

describe("CallingExtensions", () => {
  let instance: CallingExtensions;
  beforeEach(() => {
    instance = new CallingExtensions({
      debugMode: false,
      eventHandlers: {
        onCallerIdMatchFailed: noop,
        onCallerIdMatchSucceeded: noop,
        onCreateEngagementFailed: noop,
        onCreateEngagementSucceeded: noop,
        onDialNumber: noop,
        onEndCall: noop,
        onEngagementCreated: noop,
        onInitiateCallIdFailed: noop,
        onInitiateCallIdSucceeded: noop,
        onNavigateToRecordFailed: noop,
        onUpdateAssociationsFailed: noop,
        onPublishToChannelFailed: noop,
        onPublishToChannelSucceeded: noop,
        onFinalizeEngagementFailed: noop,
        onFinalizeEngagementSucceeded: noop,
        onReady: noop,
        onSetCallState: noop,
        onSetWidgetUrlFailed: noop,
        onUpdateEngagementFailed: noop,
        onUpdateEngagementSucceeded: noop,
        onVisibilityChanged: noop,
        onFailed: noop,
      },
    });
  });
  it("should instantiate", () => {
    expect(instance).toBeDefined();
  });

  describe("Method calls", () => {
    beforeEach(() => {
      spyOn(instance, "sendMessage");
    });

    it("should handle user logged in.", () => {
      instance.userLoggedIn();
      expect(instance.sendMessage).toHaveBeenCalledWith({
        type: messageType.LOGGED_IN,
      });
    });

    it("should handle user logged out.", () => {
      instance.userLoggedOut();
      expect(instance.sendMessage).toHaveBeenCalledWith({
        type: messageType.LOGGED_OUT,
      });
    });

    it("should handle user available.", () => {
      instance.userAvailable();
      expect(instance.sendMessage).toHaveBeenCalledWith({
        type: messageType.USER_AVAILABLE,
      });
    });

    it("should handle user unavailable.", () => {
      instance.userUnavailable();
      expect(instance.sendMessage).toHaveBeenCalledWith({
        type: messageType.USER_UNAVAILABLE,
      });
    });

    it("should handle incoming call.", () => {
      const callData: OnIncomingCall = {
        fromNumber: "+1234567890",
        externalCallId: "fake-id",
        toNumber: "+0987654321",
      };
      instance.incomingCall(callData);
      expect(instance.sendMessage).toHaveBeenCalledWith({
        type: messageType.INCOMING_CALL,
        data: callData,
      });
    });

    it("should handle initialize.", () => {
      const data: OnInitialized = {
        isLoggedIn: true,
      };
      instance.initialized(data);
      expect(instance.sendMessage).toHaveBeenCalledWith({
        type: messageType.INITIALIZED,
        data: { ...data },
      });
    });

    it("should handle outgoing call.", () => {
      const data: OnOutgoingCall = {
        createEngagement: true,
        externalCallId: "fake-id",
      };
      instance.outgoingCall(data);
      expect(instance.sendMessage).toHaveBeenCalledWith({
        type: messageType.OUTGOING_CALL_STARTED,
        data,
      });
    });

    it("should handle call completed.", () => {
      const data: OnCallCompleted = {
        engagementId: 123,
        externalCallId: "fake-id",
      };
      instance.callCompleted(data);
      expect(instance.sendMessage).toHaveBeenCalledWith({
        type: messageType.CALL_COMPLETED,
        data,
      });
    });

    it("should resize widget.", () => {
      const data = {
        width: 1234,
        height: 1234,
      };
      instance.resizeWidget(data);
      expect(instance.sendMessage).toHaveBeenCalledWith({
        type: messageType.RESIZE_WIDGET,
        data,
      });
    });

    it("should send data.", () => {
      const data = {
        width: 1234,
        height: 1234,
      };
      instance.callData(data);
      expect(instance.sendMessage).toHaveBeenCalledWith({
        type: messageType.CALL_DATA,
        data,
      });
    });
  });
});
