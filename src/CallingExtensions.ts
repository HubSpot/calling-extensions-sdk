import IFrameManager from "./IFrameManager";
import {
  messageType,
  debugMessageType,
  errorType,
  VERSION,
  messageHandlerNames,
} from "./Constants";
import {
  EventHandlers,
  OnCallAnswered,
  OnCallCompleted,
  OnCallEnded,
  OnError,
  OnFinalizeEngagement,
  OnIncomingCall,
  OnInitialized,
  OnMessage,
  OnNavigateToRecord,
  OnOutgoingCall,
  OnPublishToChannel,
  OnResize,
  OnSetWidgetUrl,
  Options,
} from "./types";

const prefix = `[calling-extensions-sdk@${VERSION}]`;

/*
 * CallingExtensions allows call providers to communicate with HubSpot.
 */
class CallingExtensions {
  options: Options;
  iFrameManager: IFrameManager;
  /**
   * @param {Options} options
   */
  constructor(options: Options) {
    if (!options || !options.eventHandlers) {
      throw new Error("Invalid options or missing eventHandlers.");
    }

    this.options = options;

    this.iFrameManager = new IFrameManager({
      iFrameOptions: options.iFrameOptions,
      debugMode: options.debugMode,
      onMessageHandler: (event: any) =>
        // eslint-disable-next-line implicit-arrow-linebreak
        this.onMessageHandler(event),
    });
  }

  /**
   * Send a message indicating that the soft phone is ready for interaction.
   *
   * @param {OnInitialized} payload
   */
  initialized(payload: OnInitialized) {
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
   * Sends a message indicating that the user has logged in.
   */
  userLoggedIn() {
    this.sendMessage({
      type: messageType.LOGGED_IN,
    });
  }

  /**
   * Sends a message indicating that the user has logged out.
   */
  userLoggedOut() {
    this.sendMessage({
      type: messageType.LOGGED_OUT,
    });
  }

  /**
   * Event when incoming call is received.
   *
   * @param {OnIncomingCall} callInfo
   */
  incomingCall(callInfo: OnIncomingCall) {
    this.sendMessage({
      type: messageType.INCOMING_CALL,
      data: callInfo,
    });
  }

  /**
   * Sends a message to notify HubSpot that an outgoing call has started.
   *
   * @param {OnOutgoingCall} callInfo
   */
  outgoingCall(callInfo: OnOutgoingCall) {
    this.sendMessage({
      type: messageType.OUTGOING_CALL_STARTED,
      data: callInfo,
    });
  }

  /**
   * Sends a message to notify HubSpot that a call is being answered.
   *
   * @param {OnCallAnswered} payload
   */
  callAnswered(payload: OnCallAnswered) {
    this.sendMessage({
      type: messageType.CALL_ANSWERED,
      data: payload,
    });
  }

  /**
   * Event to navigate to record page.
   *
   * @param {OnNavigateToRecord} payload
   */
  navigateToRecord(payload: OnNavigateToRecord) {
    this.sendMessage({
      type: messageType.NAVIGATE_TO_RECORD,
      data: payload,
    });
  }

  /**
   * @param {any} payload
   */
  callData(payload: any) {
    this.sendMessage({
      type: messageType.CALL_DATA,
      data: payload,
    });
  }

  /**
   * Sends a message to notify HubSpot that the call has ended.
   *
   * @param {OnCallEnded} data
   */
  callEnded(data: OnCallEnded) {
    this.sendMessage({
      type: messageType.CALL_ENDED,
      data,
    });
  }

  /**
   * Sends a message to notify HubSpot that the call has completed.
   *
   * @param {OnCallCompleted} data
   */
  callCompleted(data: OnCallCompleted) {
    this.sendMessage({
      type: messageType.CALL_COMPLETED,
      data,
    });
  }

  /**
   * Sends a message to notify HubSpot that the calling app has encountered an error.
   * @param {OnError} data
   */
  sendError(data: OnError) {
    this.sendMessage({
      type: messageType.ERROR,
      data,
    });
  }

  /**
   * Sends a message to notify HubSpot that the calling app needs to be resized.
   *
   * @param {OnResize} data
   */
  resizeWidget(data: OnResize) {
    this.sendMessage({
      type: messageType.RESIZE_WIDGET,
      data,
    });
  }

  /**
   *
   * @param {OnMessage} message
   */
  sendMessage(message: OnMessage) {
    this.iFrameManager.sendMessage(message);
  }

  /**
   *
   * @param {{message: string, type: string}} param0
   */
  logDebugMessage({
    message,
    type = debugMessageType.GENERIC_MESSAGE,
  }: {
    message: string;
    type: string;
  }) {
    this.iFrameManager.logDebugMessage(prefix, type, message);
  }

  /**
   * @param {{ type: keyof EventHandlers; data: any; }} event
   */
  onMessageHandler(event: { type: keyof EventHandlers; data: any }) {
    const { type, data } = event;
    const { eventHandlers } = this.options;

    let handler;

    if (type in messageHandlerNames) {
      const name = messageHandlerNames[type];
      if (name in eventHandlers) {
        handler = eventHandlers[name];
      }
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

    const isFailedEvent = String(type).endsWith("_FAILED");

    if (isFailedEvent) {
      const failedHandler =
        eventHandlers[messageType.FAILED as keyof EventHandlers];
      if (failedHandler) {
        failedHandler(data, event);
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

  /**
   * Publishes the call to a connected channel.
   *
   * @param {OnPublishToChannel} data - The data object to be published.
   * @deprecated use finalizeEngagement instead
   */
  publishToChannel(data: OnPublishToChannel) {
    this.sendMessage({
      type: messageType.PUBLISH_TO_CHANNEL,
      data,
    });
  }

  /**
   * Finalizes the engagement.
   *
   * @param {OnFinalizeEngagement} data - The data object to be published.
   */
  finalizeEngagement(data: OnFinalizeEngagement) {
    this.sendMessage({
      type: messageType.FINALIZE_ENGAGEMENT,
      data,
    });
  }

  /**
   * Sends a message to update the widget url.
   *
   * @param {OnSetWidgetUrl} data - The data object to be published.
   */
  setWidgetUrl(data: OnSetWidgetUrl) {
    this.sendMessage({
      type: messageType.SET_WIDGET_URL,
      data,
    });
  }
}

export default CallingExtensions;
