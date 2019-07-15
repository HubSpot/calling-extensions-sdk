import CallingExtensions, { Constants } from "../dist/main";
const { messageType } = Constants;
describe("CallingExtensions", () => {
  let instance;
  beforeEach(() => {
    instance = new CallingExtensions({
      eventHandlers: {}
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
        type: messageType.LOGGED_IN
      });
    });

    it("should handle user logged out.", () => {
      instance.userLoggedOut();
      expect(instance.sendMessage).toHaveBeenCalledWith({
        type: messageType.LOGGED_OUT
      });
    });

    it("should handle incoming call.", () => {
      const callData = {
        phoneNumber: 1234
      };
      instance.incomingCall(callData);
      expect(instance.sendMessage).toHaveBeenCalledWith({
        type: messageType.INCOMING_CALL,
        data: callData
      });
    });

    it("should handle initialize.", () => {
      const data = {
        phoneNumber: 1234
      };
      instance.initialized(data);
      expect(instance.sendMessage).toHaveBeenCalledWith({
        type: messageType.INITIALIZED,
        data
      });
    });

    it("should resize widget.", () => {
      const data = {
        width: 1234,
        height: 1234
      };
      instance.resizeWidget(data);
      expect(instance.sendMessage).toHaveBeenCalledWith({
        type: messageType.RESIZE_WIDGET,
        data
      });
    });

    it("should send data.", () => {
      const data = {
        width: 1234,
        height: 1234
      };
      instance.callData(data);
      expect(instance.sendMessage).toHaveBeenCalledWith({
        type: messageType.CALL_DATA,
        data
      });
    });
  });
});
