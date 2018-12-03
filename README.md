# Overview

Calling Extension SDK enables an integrated end user calling experience for both outbound and inbound calling.

The soft phone widget is rendered inside HubSpot CRM and a lightweight wrapper around HTML5 postMessage API facilitates cross-origin communication between a soft phone widget and HubSpot.

# Typical message flow

### Loading the widget

The following messages are exchanged when a calling widget is instantiated -

1. [HubSpot] Sends a SYNC message
2. [SoftPhone] Sends SYNC_ACK message
3. [SoftPhone] Sends INITIALIZED message with login state and optionally widegt size

After this point, the messages can be exchanged between the soft phone widget and HubSpot.

Note that the SYNC message sent repetidly until it receives a response from the iFrame to account for slow loading of

### Outbound call

The following messages are exchanged when user initiates a call -

1. [HubSpot] Sends DIAL_NUMBER message with phone_number to dial
2. [SoftPhone] Sends DATA message with engagementId once the engagement is created

### Incoming call

The following messages are exchanged for an incoming call -

1. [SoftPhone] Sends the INCOMING_CALL message with caller information
2. [SoftPhone] Sends DATA message with enagegementId once the engagement is created

# Getting Started

## Register you calling extensions

TBD - Register the calling application and the calling extensions

## Integrate Calling Extensions SDK

### Get the Calling Extension SDK

Download the SDK using npm or yarn

```shell
npm install -s @hs/TBD
```

### Using the Calling Extension SDK

The Calling Extension SDK exposes a simple API for HubSpot and a Soft Phone to exchange messages. The messages are sent as a method call and received through eventHandlers.

#### Create an instance

```js
import CallingExtensionAPI from "CallingExtensionAPI";

const options = {
  // Whether to log various inbound/outbound messages to console
  debugMode: true | false,
  // eventHandlers handle inbound messages
  eventHandlers: {
    onDialNumber: event => {},
    onVisibilityChanged: event => {}
  }
};

const callingExtensionAPI = new CallingExtensionAPI(options);
```

#### Sending the messages to HubSpot

The messages are sent to HubSpot through method calls. Following is a list of messages that can be sent to HubSpot

- INITIALIZED

  Sends a message indicating that the soft phone is ready for interaction.

  ```js
  const payload
  {
      // Whether a user is logged-in
      isLoggedIn: true|false,
      // Optionally send the desired widget size
      widgetSize: {
          height: number,
          width: number
      }
  }
  callingExtensionAPI.initialized(payload);
  ```

- LOGGED_IN

  Sends a message indicating that user has logged in

  ```js
  callingExtensionAPI.userLoggedIn();
  ```

- LOGGED_OUT

  Sends a message indicating that user has logged out

  ```js
  callingExtensionAPI.userLoggedOut();
  ```

- INCOMING_CALL

  Sends a message to notify HubSpot of an incoming call.

  Note that the incoming calling is not yet supported across HubSpot. If the widget is active, this method will ensure that the widget is made visible.

  ```js
  const callInfo = { phoneNumber: string };
  callingExtensionAPI.incomingCall(callInfo);
  ```

- OUTGOING_CALL_STARTED

  Sends a message to notify HubSpot that an outgoing call has started.

  ```js
  const callInfo = { phoneNumber: string };
  callingExtensionAPI.outgoingCall(callInfo);
  ```

  - CALL_ANSWERED

  Sends a message to notify HubSpot that an outgoing call is being answered.

  ```js
  callingExtensionAPI.callAnswered();
  ```

  - CALL_ENDED

  Sends a message to notify HubSpot that the call has ended.

  ```js
  callingExtensionAPI.callEnded();
  ```

* RINGTONE_ENDED

Sends a message to notify HubSpot that an outgoing call ringtone has ended.

```js
const callInfo = { reason: answered | disconnected | rejected };
callingExtensionAPI.ringtoneEnded(callInfo);
```

- RESIZE_WIDGET

  Sends a message to resize the iFrame

  ```js
  const newSize = { width: number, height: number };
  callingExtensionAPI.resizeWidget(newSize);
  ```

- CALL_DATA

  Sends a message transferring the engagementId

  ```js
  const data = {
    // engagementId of the enagagement created for this call (inbound or outbound)
    engagementId: number
  };
  callingExtensionAPI.sendCallData(data);
  ```

#### Handling a message sent from HubSpot to the soft phone

- onDialNumber

  Handler for the dial number event.

  ```js
    onDialNumber(data) {
        const { phoneNumber } = data;
        ...
    }
  ```

- Visibility Change

  Handler for the dial number event.

  ```js
    onVisibilityChanged(data) {
        const { isMinimized, isHidden } = data;
        ...
    }
  ```

# Feedback

# License

TBD
