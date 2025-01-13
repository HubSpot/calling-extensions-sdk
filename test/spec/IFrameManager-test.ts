import IFrameManager from "../../src/IFrameManager";
import { VERSION, messageType } from "../../src/Constants";

describe("iFrameManager", () => {
  const defaultOptions = {
    onMessageHandler: () => {},
    debugMode: false,
  };

  function createInstance(options = {}) {
    return new IFrameManager(Object.assign(options, defaultOptions));
  }

  describe("as iFrame", () => {
    it("creates instance", () => {
      const instance = createInstance();
      expect(instance).toBeDefined();
    });

    it("should create messageId", () => {
      expect(IFrameManager.createMessageId(123)).toBeDefined();
    });

    it("should get origin", () => {
      const instance = createInstance();
      expect(instance.destinationHost).toBe(window.location.origin);
    });

    it("should handle incoming SYNC message", () => {
      const instance = createInstance();
      spyOn(instance, "sendMessage");

      const eventData = {
        origin: window.location.origin,
        data: {
          type: messageType.SYNC,
        },
      };

      instance.onMessage(eventData);
      expect(instance.sendMessage).toHaveBeenCalledWith(
        jasmine.objectContaining({
          type: messageType.SYNC_ACK,
          debugMode: false,
          version: VERSION,
          iFrameUrl: IFrameManager.extractHostFromUrl(window.location.href),
        }),
      );
    });
  });

  describe("as iFrame host", () => {
    it("should validate iFrameOptions", () => {
      expect(
        () =>
          new IFrameManager({
            iFrameOptions: {
              src: "",
              height: "",
              width: "",
              hostElementSelector: "",
            },
            debugMode: false,
            onMessageHandler: () => {},
          }),
      ).toThrow();
    });

    it("should get host element", () => {
      expect(IFrameManager.getHostElement("body")).toBe(
        document.querySelector("body")!,
      );
    });

    const options = {
      iFrameOptions: {
        hostElementSelector: "body",
        src: "https://a.b.c.d.e.f.c",
        width: "100px",
        height: "100px",
      },
    };

    it("should get origin", done => {
      spyOn(IFrameManager, "createIFrame").and.returnValue({
        contentWindow: null,
      } as HTMLIFrameElement);
      const instance = createInstance(options);
      expect(instance).toBeDefined();

      expect(instance.destinationHost).toBe(options.iFrameOptions.src);
      done();
    });

    it("should create an iFrame with options", () => {
      const createIFrameSpy = spyOn(
        IFrameManager,
        "createIFrame",
      ).and.returnValue({ contentWindow: null } as HTMLIFrameElement);
      const instance = createInstance(options);
      expect(instance).toBeDefined();

      expect(createIFrameSpy).toHaveBeenCalledWith(
        jasmine.objectContaining({
          hostElementSelector: "body",
          src: "https://a.b.c.d.e.f.c",
          width: "100px",
          height: "100px",
        }),
        jasmine.any(Function),
        jasmine.any(Function),
      );
    });
  });
});
