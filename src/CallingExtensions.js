"use es6";

import IFrameManager from "./IFrameManager";
import { messageType, errorType } from "./Constants";

/*
 * CallingExtensions allows call providers to communicate with HubSpot.
 */
class CallingExtensions {
  constructor(options) {
    if (!options || !options.eventHandlers) {
      throw new Error("Invalid options or missing eventHandlers.");
    }

    this.options = options;

    this.iFrameManager = new IFrameManager({
      debugMode: options.debugMode,
      onMessageHandler: event => this.onMessageHandler(event)
    });
  }

  initialized(userData) {
    this.sendMessage({
      type: messageType.INITIALIZED,
      data: userData
    });
  }

  userLoggedIn() {
    this.sendMessage({
      type: messageType.LOGGED_IN
    });
  }

  userLoggedOut() {
    this.sendMessage({
      type: messageType.LOGGED_OUT
    });
  }

  incomingCall(callDetails) {
    this.sendMessage({
      type: messageType.INCOMING_CALL,
      data: callDetails
    });
  }

  outgoingCall(callDetails) {
    this.sendMessage({
      type: messageType.OUTGOING_CALL_STARTED,
      data: callDetails
    });
  }

  callAnswered() {
    this.sendMessage({
      type: messageType.CALL_ANSWERED
    });
  }

  callData(data) {
    this.sendMessage({
      type: messageType.CALL_DATA,
      data
    });
  }

  callEnded(engagementData) {
    this.sendMessage({
      type: messageType.CALL_ENDED,
      data: engagementData
    });
  }

  callCompleted(callCompletedData) {
    this.sendMessage({
      type: messageType.CALL_COMPLETED,
      data: callCompletedData
    });
  }

  sendError(errorData) {
    this.sendMessage({
      type: messageType.ERROR,
      data: errorData
    });
  }

  resizeWidget(sizeInfo) {
    this.sendMessage({
      type: messageType.RESIZE_WIDGET,
      data: sizeInfo
    });
  }

  sendMessage(message) {
    this.iFrameManager.sendMessage(message);
  }

  onMessageHandler(event) {
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
      default: {
        // Send back a message indicating an unknown event is received
        this.sendMessage({
          type: messageType.ERROR,
          data: {
            type: errorType.UNKNOWN_MESSAGE_TYPE,
            data: {
              originalMessage: event
            }
          }
        });
        break;
      }
    }
    handler = handler || eventHandlers.defaultEventHandler;
    if (handler) {
      handler(data, event);
    } else {
      console.error(
        `No event handler is available to handle message of type: ${type}`
      );
    }
  }
}

export default CallingExtensions;
