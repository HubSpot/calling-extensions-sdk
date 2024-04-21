"use es6";

import IFrameManager from "./IFrameManager";
import {
  messageType,
  debugMessageType,
  errorType,
  VERSION,
  messageHandlerNames,
} from "./Constants";

const prefix = `[calling-extensions-sdk@${VERSION}]`;

/**
 * @typedef {Object} EventHandlers
 * @property {function} onReady - Called when HubSpot is ready to receive messages.
 * @property {function} onDialNumber - Called when the HubSpot sends a dial number from the contact.
 * @property {function} onEngagementCreated - Called when HubSpot creates an engagement
 * for the call.
 * @property {function} onVisibilityChanged - Called when the call widget's visibility changes.
 */

/**
 * @typedef {Object} IframeOptions
 * @property {string} src - iframe URL
 * @property {string} height - Height of iframe
 * @property {string} width - Width of iframe
 * @property {string} hostElementSelector - Selector for host element where iframe will be bound
 */

/**
 * @typedef {Object} Options
 * @property {IframeOptions} iFrameOptions - iFrame configuration options
 * @property {boolean} debugMode - Whether to log various inbound/outbound debug messages
 * to the console.
 * @property {EventHandlers} eventHandlers - Event handlers handle inbound messages.
 */

/*
 * CallingExtensions allows call providers to communicate with HubSpot.
 */
class CallingExtensions {
  /**
   * @param {Options} options
   */
  constructor(options) {
    if (!options || !options.eventHandlers) {
      throw new Error("Invalid options or missing eventHandlers.");
    }

    this.options = options;

    this.iFrameManager = new IFrameManager({
      iFrameOptions: options.iFrameOptions,
      debugMode: options.debugMode,
      onMessageHandler: event => this.onMessageHandler(event),
    });
  }

  initialized(userData) {
    this.sendMessage({
      type: messageType.INITIALIZED,
      data: { ...userData },
    });
  }

  userAvailable() {
    this.sendMessage({
      type: messageType.USER_AVAILABLE,
    });
  }

  userUnavailable() {
    this.sendMessage({
      type: messageType.USER_UNAVAILABLE,
    });
  }

  userLoggedIn() {
    this.sendMessage({
      type: messageType.LOGGED_IN,
    });
  }

  userLoggedOut() {
    this.sendMessage({
      type: messageType.LOGGED_OUT,
    });
  }

  incomingCall(callDetails) {
    this.sendMessage({
      type: messageType.INCOMING_CALL,
      data: callDetails,
    });
  }

  outgoingCall(callDetails) {
    this.sendMessage({
      type: messageType.OUTGOING_CALL_STARTED,
      data: callDetails,
    });
  }

  callAnswered() {
    this.sendMessage({
      type: messageType.CALL_ANSWERED,
    });
  }

  navigateToRecord(data) {
    this.sendMessage({
      type: messageType.NAVIGATE_TO_RECORD,
      data,
    });
  }

  callData(data) {
    this.sendMessage({
      type: messageType.CALL_DATA,
      data,
    });
  }

  callEnded(engagementData) {
    this.sendMessage({
      type: messageType.CALL_ENDED,
      data: engagementData,
    });
  }

  callCompleted(callCompletedData) {
    this.sendMessage({
      type: messageType.CALL_COMPLETED,
      data: callCompletedData,
    });
  }

  sendError(errorData) {
    this.sendMessage({
      type: messageType.ERROR,
      data: errorData,
    });
  }

  resizeWidget(sizeInfo) {
    this.sendMessage({
      type: messageType.RESIZE_WIDGET,
      data: sizeInfo,
    });
  }

  sendMessage(message) {
    this.iFrameManager.sendMessage(message);
  }

  logDebugMessage({ message, type = debugMessageType.GENERIC_MESSAGE }) {
    this.iFrameManager.logDebugMessage(prefix, type, message);
  }

  onMessageHandler(event) {
    const { type, data } = event;
    const { eventHandlers } = this.options;

    let handler;
    if (type in messageHandlerNames) {
      const name = messageHandlerNames[type];
      handler = eventHandlers[name];
    } else {
      // Send back a message indicating an unknown event is received
      this.sendMessage({
        type: messageType.ERROR,
        data: {
          type: errorType.UNKNOWN_MESSAGE_TYPE,
          data: {
            originalMessage: event,
          },
        },
      });
    }

    handler = handler || eventHandlers.defaultEventHandler;
    if (handler) {
      handler(data, event);
    } else {
      console.error(
        `No event handler is available to handle message of type: ${type}`,
      );
    }
  }

  /**
   * Publishes the call to a connected channel.
   *
   * @param {Object} data - The data object to be published.
   * @param {number} data.engagementId - The HubSpot engagementId created by the calling app.
   */
  publishToChannel(data) {
    this.sendMessage({
      type: messageType.PUBLISH_TO_CHANNEL,
      data,
    });
  }
}

export default CallingExtensions;
