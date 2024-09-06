"use es6";

import IFrameManager from "./IFrameManager";
import {
  messageType,
  debugMessageType,
  errorType,
  VERSION,
  messageHandlerNames,
} from "./Constants";
import "./typedefs";

const prefix = `[calling-extensions-sdk@${VERSION}]`;

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

  /**
   *
   * @param {OnInitialized} payload
   */
  initialized(payload) {
    this.sendMessage({
      type: messageType.INITIALIZED,
      data: payload,
    });
  }

  /**
   * Event when user's availability is changed to available
   */
  userAvailable() {
    this.sendMessage({
      type: messageType.USER_AVAILABLE,
    });
  }

  /**
   * Event when user's availability is changed to unavailable
   */
  userUnavailable() {
    this.sendMessage({
      type: messageType.USER_UNAVAILABLE,
    });
  }

  /**
   * Event when user is logged in
   */
  userLoggedIn() {
    this.sendMessage({
      type: messageType.LOGGED_IN,
    });
  }

  /**
   * Event when user is logged out
   */
  userLoggedOut() {
    this.sendMessage({
      type: messageType.LOGGED_OUT,
    });
  }

  /**
   * Event when incoming call is received.
   *
   * @param {OnIncomingCall} callDetails
   */
  incomingCall(callDetails) {
    this.sendMessage({
      type: messageType.INCOMING_CALL,
      data: callDetails,
    });
  }

  /**
   * Event when outgoing call has started.
   *
   * @param {OnOutgoingCall} callDetails
   */
  outgoingCall(callDetails) {
    this.sendMessage({
      type: messageType.OUTGOING_CALL_STARTED,
      data: callDetails,
    });
  }

  /**
   * Event when an inbound call is answered.
   *
   * @param {OnCallAnswered} data - The data object to be published.
   */
  callAnswered(data) {
    this.sendMessage({
      type: messageType.CALL_ANSWERED,
      data,
    });
  }

  /**
   * Event to navigate to record page.
   *
   * @param {OnNavigateToRecord} data
   */
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

  /**
   * Event when call has ended.
   *
   * @param {OnCallEnded} engagementData
   */
  callEnded(engagementData) {
    this.sendMessage({
      type: messageType.CALL_ENDED,
      data: engagementData,
    });
  }

  /**
   * Event when call is completed/saved.
   *
   * @param {OnCallCompleted} callCompletedData
   */
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

  /**
   * Event to resize the widget to new dimensions.
   *
   * @param {OnResize} sizeInfo
   */
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
   * @param {OnPublishToChannel} data - The data object to be published.
   */
  publishToChannel(data) {
    this.sendMessage({
      type: messageType.PUBLISH_TO_CHANNEL,
      data,
    });
  }
}

export default CallingExtensions;
