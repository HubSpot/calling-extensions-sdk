"use es6";

import { Constants, IFrameManager } from "../dist/main";
const { messageType } = Constants;

describe("iFrameManager", () => {
  const defaultOptions = {
    onMessageHandler: () => {}
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
          type: messageType.SYNC
        }
      };

      instance.onMessage(eventData);
      expect(instance.sendMessage).toHaveBeenCalledWith({
        type: messageType.SYNC_ACK,
        debugMode: undefined,
        version: "0.0.1",
        iFrameUrl: IFrameManager.extractHostFromUrl(window.location.href)
      });
    });
  });

  describe("as iFrame host", () => {
    function createHostInstanceAndTest(optionsOverrides, test) {
      const options = Object.assign(
        {
          iFrameOptions: {
            hostElementSelector: "body",
            src: "http://a.b.c.d.e.f.c",
            width: "100px",
            height: "100px"
          }
        },
        optionsOverrides
      );
      const instance = createInstance(options);
      expect(instance).toBeDefined();

      test(instance, options);

      instance.remove();
      const element = document.querySelector("iFrame");
      expect(element).not.toBeTruthy();
    }

    it("should validate iFrameOptions", () => {
      expect(() => new IFrameManager({ iFrameOptions: {} })).toThrow();
    });

    it("should get host element", () => {
      expect(IFrameManager.getHostElement("body")).toBe(
        document.querySelector("body")
      );
    });

    it("should get origin", () => {
      createHostInstanceAndTest({}, (instance, options) => {
        expect(instance.destinationHost).toBe(options.iFrameOptions.src);
      });
    });

    it("should create an iFrame", () => {
      createHostInstanceAndTest({}, (instance, options) => {
        const element = document.querySelector("iFrame");
        expect(element).toBeDefined();

        const attributes = element.attributes;
        ["src", "width", "height"].forEach(key => {
          expect(attributes[key].value).toBe(options.iFrameOptions[key]);
        });
      });
    });
  });
});
