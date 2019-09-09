"use es6";

import { messageType, VERSION } from "./Constants";

/*
 * IFrameManager abstracts the iFrame communication between the IFrameHost and an IFrame
 * An IFrameManager instance can act as part of the IFrameHost and an IFrame depending on
 * the options.
 */
class IFrameManager {
  constructor(options) {
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
      this.iFrame = IFrameManager.createIFrame(iFrameOptions, () => {
        this.firstSyncSent = Date.now();
        this.isReady = false;
        this.sendSync();
      });
    }

    this.destinationWindow = iFrameOptions
      ? this.iFrame.contentWindow
      : window.parent;

    this.destinationHost = IFrameManager.getDestinationHost(iFrameOptions);
  }

  /*
   * Creates a new message id
   */
  static createMessageId(instanceId) {
    return `${instanceId}_${Date.now()}`;
  }

  /*
   * Gets the html element that hosts the iFrame
   */
  static getHostElement(hostElementSelector) {
    const hostElement = document.querySelector(hostElementSelector);
    if (!hostElement) {
      throw new Error(
        `hostElement not found. Selector - ${hostElementSelector}`
      );
    }
    return hostElement;
  }

  static extractHostFromUrl(url) {
    const a = document.createElement("a");
    a.href = url;
    return `${a.protocol}//${a.host}`;
  }

  static getDestinationHost(iFrameOptions) {
    const url = iFrameOptions ? iFrameOptions.src : document.referrer;
    return IFrameManager.extractHostFromUrl(url);
  }

  static createIFrame(iFrameOptions, onLoadCallback) {
    const { src, width, height, hostElementSelector } = iFrameOptions;

    if (!src || !width || !height || !hostElementSelector) {
      throw new Error(
        "iFrameOptions is missing one of the required properties - {src, width, height, hostElementSelector}."
      );
    }

    const iFrame = document.createElement("iFrame");
    iFrame.onload = onLoadCallback;
    iFrame.onerror = this.handleLoadError;
    iFrame.src = src;
    iFrame.width = width;
    iFrame.height = height;
    iFrame.allow = "microphone; autoplay";
    iFrame.id = "hubspot-calling-extension-iframe";

    const element = IFrameManager.getHostElement(hostElementSelector);
    element.innerHTML = "";
    element.appendChild(iFrame);

    return element.querySelector("iFrame");
  }

  handleLoadError() {
    this.onMessageHandler({
      type: messageType.SYNC_ACK_FAILED
    });
  }

  updateIFrameSize(sizeInfo) {
    const { width, height } = sizeInfo;
    const formatSize = size => (typeof size === "number" ? `${size}px` : size);
    if (width) {
      this.iFrame.setAttribute("width", formatSize(width));
    }
    if (height) {
      this.iFrame.setAttribute("height", formatSize(height));
    }
  }

  onReady() {
    this.isReady = true;
    this.onMessageHandler({
      type: messageType.READY
    });
  }
  /*
   * Unload the iFrame
   */
  remove() {
    window.removeEventListener("message", this.messageHandler);

    if (this.iFrame) {
      const element = IFrameManager.getHostElement(
        this.options.iFrameOptions.hostElementSelector
      );
      element.innerHTML = "";

      this.isReady = false;
      this.iFrame = null;
      this.options = null;
    }
  }

  /*
   * Send a message to the destination window.
   */
  sendMessage(message, callback) {
    const { type } = message;
    if (type !== messageType.SYNC && !this.isReady) {
      // Do not send a message unless the iFrame is ready to receive.
      console.warn("iFrame not initialized to send a message", message);
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
      messageId
    });

    this.logDebugMessage("postMessage", type, message);
    this.destinationWindow.postMessage(newMessage, this.destinationHost);
  }

  onMessage(event) {
    const { data, origin } = event;
    const { type } = event.data;
    if (type === messageType.SYNC) {
      // The iFrame host can send this message multiple times, don't respond more than once
      if (!this.isReady) {
        this.isReady = true;

        const message = Object.assign({}, event.data, {
          type: messageType.SYNC_ACK,
          debugMode: this.debugMode,
          version: VERSION,
          iFrameUrl: IFrameManager.extractHostFromUrl(window.location.href)
        });

        const { hostUrl } = event.data;
        this.destinationHost = hostUrl || this.destinationHost;
        this.sendMessage(message);
        this.onReady();
      }
      return;
    }

    if (this.destinationHost !== origin) {
      // Ignore messages from an unknown origin
      return;
    }

    if (type === messageType.SET_WIDGET_URL) {
      const { iFrameUrl } = data;
      this.destinationHost = iFrameUrl || this.destinationHost;
      return;
    }

    const { messageId } = data;

    if (!messageId || !type) {
      return;
    }

    this.logDebugMessage("onMessage", type, { data });
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
        type: messageType.SYNC_ACK_FAILED
      });
      return;
    }

    this.sendMessage(
      {
        type: messageType.SYNC,
        hostUrl: IFrameManager.extractHostFromUrl(window.location.href)
      },
      eventData => {
        const { iFrameUrl } = eventData;
        this.destinationHost = iFrameUrl || this.destinationHost;
        this.onReady();
        this.debugMode = eventData && eventData.debugMode;
      }
    );

    // In cases where the call widget loads the calling extensions asynchronously, message
    // handlers may not be set up - retry until a response from the iFrame
    window.setTimeout(() => {
      if (this.iFrame && !this.isReady) {
        this.sendSync();
      }
    }, 100);
  }

  logDebugMessage(...args) {
    if (this.debugMode) {
      const msg = this.isIFrameHost ? "IFrame host" : "IFrame";
      args.unshift(msg);
      console.log.call(null, args);
    }
  }
}

export default IFrameManager;
