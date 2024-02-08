import IFrameManager from "./IFrameManager";
import {
  messageType,
  messageHandlerNames,
  errorType,
  debugMessageType,
} from "./Constants";
import {
  CallingExtensionsContract,
  CallingExtensionsOptions,
  OnCallCompletedPayload,
  OnCallEndedPayload,
  OnIncomingCallPayload,
  OnInitializedPayload,
  OnNavigateToRecordPayload,
  OnOutgoingCallPayload,
  SizeInfo,
} from "./types";

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
class CallingExtensions implements CallingExtensionsContract {
  options: CallingExtensionsOptions;
  iFrameManager: IFrameManager;
  /**
   * @param {Options} options
   */
  constructor(options: CallingExtensionsOptions) {
    if (!options || !options.eventHandlers) {
      throw new Error("Invalid options or missing eventHandlers.");
    }

    this.options = options;

    this.iFrameManager = new IFrameManager({
      iFrameOptions: options.iFrameOptions,
      debugMode: options.debugMode,
      onMessageHandler: (event: any) => this.onMessageHandler(event),
    });
  }

  initialized(userData: OnInitializedPayload) {
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

  incomingCall(callDetails: OnIncomingCallPayload) {
    this.sendMessage({
      type: messageType.INCOMING_CALL,
      data: callDetails,
    });
  }

  outgoingCall(callDetails: OnOutgoingCallPayload) {
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

  navigateToRecord(data: OnNavigateToRecordPayload) {
    this.sendMessage({
      type: messageType.NAVIGATE_TO_RECORD,
      data,
    });
  }

  callData(data: unknown) {
    this.sendMessage({
      type: messageType.CALL_DATA,
      data,
    });
  }

  callEnded(engagementData: OnCallEndedPayload) {
    this.sendMessage({
      type: messageType.CALL_ENDED,
      data: engagementData,
    });
  }

  callCompleted(callCompletedData: OnCallCompletedPayload) {
    this.sendMessage({
      type: messageType.CALL_COMPLETED,
      data: callCompletedData,
    });
  }

  sendError(errorData: any) {
    this.sendMessage({
      type: messageType.ERROR,
      data: errorData,
    });
  }

  resizeWidget(sizeInfo: SizeInfo) {
    this.sendMessage({
      type: messageType.RESIZE_WIDGET,
      data: sizeInfo,
    });
  }

  logDebugMessage({
    message,
    type = debugMessageType.GENERIC_MESSAGE,
  }: {
    message: unknown;
    type: string;
  }) {
    this.iFrameManager.logDebugMessage(type, message);
  }

  sendMessage(message: { type: string; data?: unknown }) {
    this.iFrameManager.sendMessage(message);
  }

  private onMessageHandler(event: any) {
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
}

export default CallingExtensions;
