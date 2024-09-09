// @ts-check

"use es6";

import { messageType, debugMessageType, VERSION } from "./Constants";
import "./typedefs";

const prefix = `[calling-extensions-sdk@${VERSION}]`;
/*
 * IFrameManager abstracts the iFrame communication between the IFrameHost and an IFrame
 * An IFrameManager instance can act as part of the IFrameHost and an IFrame depending on
 * the options.
 */
class IFrameManager {
  /**
   *
   * @param {IframeManagerOptions} options
   */
  constructor(options) {
    /** @type {IframeManagerOptions | null} */
    this.options = options;
    const { iFrameOptions, onMessageHandler, debugMode } = options;

    this.onMessageHandler = onMessageHandler;
    if (!this.onMessageHandler) {
      throw new Error("Invalid options: onMessageHandler is not defined");
    }
    this.isIFrameHost = !!iFrameOptions;
    this.debugMode = debugMode;

    // Keeps track of all the callbacks
    /** @type {{ [key: string]: Function }} */
    this.callbacks = {};

    this.instanceId = Date.now();
    this.instanceRegexp = new RegExp(`^${this.instanceId}`);
    this.isReady = false;

    this.messageHandler = (/** @type {any} */ event) => this.onMessage(event);
    window.addEventListener("message", this.messageHandler);

    if (iFrameOptions) {
      /** @type {HTMLIFrameElement | null} */
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
      /** @type {HTMLIFrameElement | null} */
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
  static createMessageId(instanceId) {
    return `${instanceId}_${Date.now()}`;
  }

  /**
   * Gets the html element that hosts the iFrame
   * @param {string} hostElementSelector
   */
  static getHostElement(hostElementSelector) {
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
  static extractHostFromUrl(url) {
    const a = document.createElement("a");
    a.href = url;
    return `${a.protocol}//${a.host}`;
  }

  /**
   *
   * @param {IframeOptions} iFrameOptions
   */
  static getDestinationHost(iFrameOptions) {
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
  static createIFrame(iFrameOptions, onLoadCallback, onLoadErrorCallback) {
    // eslint-disable-next-line object-curly-newline
    const { src, width, height, hostElementSelector } = iFrameOptions;

    if (!src || !width || !height || !hostElementSelector) {
      throw new Error(
        "iFrameOptions is missing one of the required properties - {src, width, height, hostElementSelector}.",
      );
    }

    /** @type {HTMLIFrameElement} */
    const iFrame = document.createElement("iframe");
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
  updateIFrameSize(sizeInfo) {
    const { width, height } = sizeInfo;
    const formatSize = (/** @type {number} */ size) => {
      return typeof size === "number" ? `${size}px` : size;
    };
    if (width && this.iFrame) {
      this.iFrame.setAttribute("width", formatSize(width));
    }
    if (height && this.iFrame) {
      this.iFrame.setAttribute("height", formatSize(height));
    }
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

    if (this.iFrame && this.options) {
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
  sendMessage(message, callback) {
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
  onMessage(event) {
    const { data, origin } = event;
    // eslint-disable-next-line object-curly-newline
    const { type, engagementId, portalId, userId, ownerId } = event.data;
    if (type === messageType.SYNC) {
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
        });
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

    this.logDebugMessage(prefix, debugMessageType.FROM_HUBSPOT, type, data);
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
      (/** @type {{ debugMode?: any; iFrameUrl?: any; }} */ eventData) => {
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
  logDebugMessage(...args) {
    if (this.debugMode) {
      console.log.call(null, args);
      return;
    }
    console.debug.call(null, args);
  }
}

export default IFrameManager;
