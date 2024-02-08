import IFrameManager from "./IFrameManager";
import { messageType, errorType } from "./Constants";
import { IframeOptions, SizeInfo } from "./types";

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

type EventHandler = (data: unknown, event: unknown) => void;

type EventHandlers = Record<string, EventHandler> & {
  defaultEventHandler?: EventHandler;
};

interface CallingExtensionsOptions {
  iFrameOptions?: IframeOptions;
  debugMode?: boolean;
  eventHandlers: EventHandlers;
}

interface CallingExtensionsContract {
  initialized: (userData: { isLoggedIn: boolean; sizeInfo: SizeInfo }) => void;
  userLoggedIn: () => void;
  userLoggedOut: () => void;
  incomingCall: (callDetails: unknown) => void;
  outgoingCall: (callDetails: unknown) => void;
  callAnswered: () => void;
  callData: (data: unknown) => void;
  callEnded: (engagementData: unknown) => void;
  callCompleted: (engagementData: unknown) => void;
  sendError: (errorData: unknown) => void;
  resizeWidget: (sizeInfo: SizeInfo) => void;
}

/*
 * CallingExtensions allows call providers to communicate with HubSpot.
 */
class CallingExtensions implements CallingExtensionsContract {
  options: any;
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

  initialized(userData: { isLoggedIn: boolean; sizeInfo: SizeInfo }) {
    this.sendMessage({
      type: messageType.INITIALIZED,
      data: { ...userData },
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

  incomingCall(callDetails: any) {
    this.sendMessage({
      type: messageType.INCOMING_CALL,
      data: callDetails,
    });
  }

  outgoingCall(callDetails: any) {
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

  callData(data: any) {
    this.sendMessage({
      type: messageType.CALL_DATA,
      data,
    });
  }

  callEnded(engagementData: any) {
    this.sendMessage({
      type: messageType.CALL_ENDED,
      data: engagementData,
    });
  }

  callCompleted(callCompletedData: any) {
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

  private sendMessage(message: { type: string; data?: unknown }) {
    this.iFrameManager.sendMessage(message);
  }

  private onMessageHandler(event: any) {
    const { type, data } = event;
    const { eventHandlers } = this.options;
    let handler;
    switch (type) {
      case messageType.READY: {
        const { onReady } = eventHandlers;
        handler = onReady;
        break;
      }
      case messageType.DIAL_NUMBER: {
        const { onDialNumber } = eventHandlers;
        handler = onDialNumber;
        break;
      }
      case messageType.ENGAGEMENT_CREATED: {
        const { onEngagementCreated } = eventHandlers;
        handler = onEngagementCreated;
        break;
      }
      case messageType.END_CALL: {
        const { onEndCall } = eventHandlers;
        handler = onEndCall;
        break;
      }
      case messageType.VISIBILITY_CHANGED: {
        const { onVisibilityChanged } = eventHandlers;
        handler = onVisibilityChanged;
        break;
      }
      case messageType.SET_CALL_STATE: {
        const { onSetCallState } = eventHandlers;
        handler = onSetCallState;
        break;
      }
      case messageType.CREATE_ENGAGEMENT_FAILED: {
        const { onCreateEngagementFailed } = eventHandlers;
        handler = onCreateEngagementFailed;
        break;
      }
      case messageType.CREATE_ENGAGEMENT_SUCCEEDED: {
        const { onCreateEngagementSucceeded } = eventHandlers;
        handler = onCreateEngagementSucceeded;
        break;
      }
      case messageType.UPDATE_ENGAGEMENT_FAILED: {
        const { onUpdateEngagementFailed } = eventHandlers;
        handler = onUpdateEngagementFailed;
        break;
      }
      case messageType.UPDATE_ENGAGEMENT_SUCCEEDED: {
        const { onUpdateEngagementSucceeded } = eventHandlers;
        handler = onUpdateEngagementSucceeded;
        break;
      }
      default: {
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
        break;
      }
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
