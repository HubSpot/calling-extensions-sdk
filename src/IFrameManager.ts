import { messageType, debugMessageType, VERSION } from "./Constants";
import { IframeManagerOptions, IframeOptions, SizeInfo } from "./types";

const prefix = `[calling-extensions-sdk@${VERSION}]`;

/*
 * IFrameManager abstracts the iFrame communication between the IFrameHost and an IFrame
 * An IFrameManager instance can act as part of the IFrameHost and an IFrame depending on
 * the options.
 */
class IFrameManager {
  options: IframeManagerOptions | null;
  onMessageHandler: IframeManagerOptions["onMessageHandler"];
  isIFrameHost: boolean;
  debugMode: boolean;
  callbacks: { [key: string]: Function };
  instanceId: number;
  instanceRegexp: RegExp;
  isReady: boolean;
  messageHandler: (event: any) => void;
  iFrame: HTMLIFrameElement | null;
  firstSyncSent: number = 0;
  destinationWindow: Window | null;
  destinationHost: string;

  constructor(options: IframeManagerOptions) {
    this.options = options;
    const { iFrameOptions, onMessageHandler, debugMode } = options;

    this.onMessageHandler = onMessageHandler;
    if (!this.onMessageHandler) {
      throw new Error("Invalid options: onMessageHandler is not defined");
    }
    this.isIFrameHost = !!iFrameOptions;
    this.debugMode = debugMode;

    // Keeps track of all the callbacks
    this.callbacks = {};

    this.instanceId = Date.now();
    this.instanceRegexp = new RegExp(`^${this.instanceId}`);
    this.isReady = false;

    this.messageHandler = event => this.onMessage(event);
    window.addEventListener("message", this.messageHandler);

    if (iFrameOptions) {
      this.iFrame = IFrameManager.createIFrame(
        iFrameOptions,
        () => {
          this.firstSyncSent = Date.now();
          this.isReady = false;
          this.sendSync();
        },
        this.handleLoadError,
      );
    } else {
      this.iFrame = null;
    }

    this.destinationWindow =
      iFrameOptions && this.iFrame ? this.iFrame.contentWindow : window.parent;

    this.destinationHost = IFrameManager.getDestinationHost(iFrameOptions);
  }

  /**
   * Creates a new message id
   * @param {string|number} instanceId
   * @returns {string}
   */
  static createMessageId(instanceId: string | number) {
    return `${instanceId}_${Date.now()}`;
  }

  /**
   * Gets the html element that hosts the iFrame
   * @param {string} hostElementSelector
   */
  static getHostElement(hostElementSelector: string) {
    const hostElement = document.querySelector(hostElementSelector);
    if (!hostElement) {
      throw new Error(
        `hostElement not found. Selector - ${hostElementSelector}`,
      );
    }
    return hostElement;
  }

  /**
   * @param {string} url
   */
  static extractHostFromUrl(url: string) {
    const a = document.createElement("a");
    a.href = url;
    return `${a.protocol}//${a.host}`;
  }

  /**
   *
   * @param {IframeOptions} [iFrameOptions]
   */
  static getDestinationHost(iFrameOptions: IframeOptions | undefined) {
    const url = iFrameOptions ? iFrameOptions.src : document.referrer;
    return IFrameManager.extractHostFromUrl(url);
  }

  handleLoadError() {
    this.onMessageHandler({
      type: messageType.SYNC_ACK_FAILED,
    });
  }

  /**
   * @param {IframeOptions} iFrameOptions
   * @param { (this: GlobalEventHandlers, ev: Event) => any } onLoadCallback
   * @param { OnErrorEventHandler } onLoadErrorCallback
   * @returns {HTMLIFrameElement | null}
   */
  static createIFrame(
    iFrameOptions: IframeOptions,
    onLoadCallback: (event: Event) => void,
    onLoadErrorCallback: OnErrorEventHandler,
  ) {
    // eslint-disable-next-line object-curly-newline
    const { src, width, height, hostElementSelector } = iFrameOptions;

    if (!src || !width || !height || !hostElementSelector) {
      throw new Error(
        "iFrameOptions is missing one of the required properties - {src, width, height, hostElementSelector}.",
      );
    }

    const iFrame: HTMLIFrameElement = document.createElement("iframe");
    iFrame.onload = onLoadCallback;
    iFrame.onerror = onLoadErrorCallback;
    iFrame.src = src;
    iFrame.width = width;
    iFrame.height = height;
    iFrame.allow = "microphone; autoplay";
    iFrame.id = "hubspot-calling-extension-iframe";

    const element = IFrameManager.getHostElement(hostElementSelector);
    element.innerHTML = "";
    element.appendChild(iFrame);

    return element.querySelector("iframe");
  }

  /**
   * @param {SizeInfo} sizeInfo
   */
  updateIFrameSize(sizeInfo: SizeInfo) {
    const { width, height } = sizeInfo;
    if (this.iFrame) {
      if (width) {
        this.iFrame.setAttribute("width", IFrameManager.formatSize(width));
      }
      if (height) {
        this.iFrame.setAttribute("height", IFrameManager.formatSize(height));
      }
    }
  }

  /**
   *
   * @param {number | string} size
   * @returns {string}
   */
  static formatSize(size: number | string) {
    return typeof size === "number" ? `${size}px` : size;
  }

  onReady(data = {}) {
    this.isReady = true;
    this.onMessageHandler({
      type: messageType.READY,
      data,
    });
  }

  /*
   * Unload the iFrame
   */
  remove() {
    window.removeEventListener("message", this.messageHandler);

    if (this.iFrame && this.options && this.options.iFrameOptions) {
      const element = IFrameManager.getHostElement(
        this.options.iFrameOptions.hostElementSelector,
      );
      element.innerHTML = "";

      this.isReady = false;
      this.iFrame = null;
      this.options = null;
    }
  }

  /**
   * Send a message to the destination window.
   * @param {{type: string, messageId?: string|number, hostUrl?: string}} message
   * @param {function} [callback]
   */
  sendMessage(
    message: { type: string; messageId?: string | number; hostUrl?: string },
    callback?: Function,
  ) {
    const { type } = message;
    if (type !== messageType.SYNC && !this.isReady) {
      // Do not send a message unless the iFrame is ready to receive.
      console.warn(
        prefix,
        "iFrame not initialized to send a message within HubSpot",
        message,
      );
      return;
    }

    let { messageId } = message;
    if (!messageId) {
      // Initiating a new message
      messageId = IFrameManager.createMessageId(this.instanceId);
      if (callback) {
        // Keep track of the callback
        this.callbacks[messageId] = callback;
      }
    }

    const newMessage = Object.assign({}, message, {
      messageId,
    });

    this.logDebugMessage(prefix, debugMessageType.TO_HUBSPOT, type, message);
    if (this.destinationWindow) {
      this.destinationWindow.postMessage(newMessage, this.destinationHost);
    }
  }

  /**
   * @param {{ data: any; origin?: any; }} event
   */
  onMessage(event: { data: any; origin?: any }) {
    const { data, origin } = event;
    // eslint-disable-next-line object-curly-newline
    const { type } = event.data;
    if (type === messageType.SYNC) {
      const {
        portalId,
        userId,
        ownerId,
        engagementId,
        iframeLocation,
        usesCallingWindow,
      } = event.data;

      // The iFrame host can send this message multiple times, don't respond more than once
      if (!this.isReady) {
        this.isReady = true;

        const message = Object.assign({}, event.data, {
          type: messageType.SYNC_ACK,
          debugMode: this.debugMode,
          version: VERSION,
          iFrameUrl: IFrameManager.extractHostFromUrl(window.location.href),
        });

        const { hostUrl } = event.data;
        this.destinationHost = hostUrl || this.destinationHost;
        this.logDebugMessage(prefix, debugMessageType.FROM_HUBSPOT, type, data);
        this.sendMessage(message);
        this.onReady({
          engagementId,
          portalId,
          userId,
          ownerId,
          iframeLocation,
          usesCallingWindow,
          hostUrl,
        });
      }

      return;
    }

    if (this.destinationHost !== origin) {
      // Ignore messages from an unknown origin
      return;
    }

    const { messageId } = data;

    if (!messageId || !type) {
      return;
    }

    this.logDebugMessage(prefix, debugMessageType.FROM_HUBSPOT, type, data);

    if (type === messageType.SET_WIDGET_URL) {
      const { iFrameUrl } = data;
      this.destinationHost = iFrameUrl || this.destinationHost;
      this.onReady({
        iFrameUrl,
      });
      return;
    }

    if (this.instanceRegexp.test(messageId)) {
      // This is a response to some message generated by HubSpot
      const callBack = this.callbacks[messageId];
      if (callBack) {
        callBack(data);
        delete this.callbacks[messageId];
      }
      return;
    }

    // This is a new message, let the handler handle it.
    this.onMessageHandler(data);
  }

  sendSync() {
    // No SYNC_ACK message after 30sec results in a failure
    if (Date.now() - this.firstSyncSent > 30000) {
      this.onMessageHandler({
        type: messageType.SYNC_ACK_FAILED,
      });
      return;
    }

    this.sendMessage(
      {
        type: messageType.SYNC,
        hostUrl: IFrameManager.extractHostFromUrl(window.location.href),
      },
      (eventData: { debugMode?: any; iFrameUrl?: any }) => {
        const { iFrameUrl } = eventData;
        this.destinationHost = iFrameUrl || this.destinationHost;
        this.onReady();
        this.debugMode = eventData && eventData.debugMode;
      },
    );

    // In cases where the call widget loads the calling extensions asynchronously, message
    // handlers may not be set up - retry until a response from the iFrame
    window.setTimeout(() => {
      if (this.iFrame && !this.isReady) {
        this.sendSync();
      }
    }, 100);
  }

  /**
   * @param {any[]} args
   */
  logDebugMessage(...args: any[]) {
    if (this.debugMode) {
      console.log.call(null, args);
      return;
    }
    console.debug.call(null, args);
  }
}

export default IFrameManager;
