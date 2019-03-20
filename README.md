# Overview

Calling Extension SDK enables an integrated end user calling experience for both outbound and inbound calling.

The soft phone widget is rendered inside HubSpot CRM and a lightweight wrapper around HTML5 postMessage API facilitates cross-origin communication between a soft phone widget and HubSpot.

# Typical message flow

### Loading the widget

The following messages are exchanged when a calling widget is instantiated -

1. [HubSpot] Sends a SYNC message
2. [SoftPhone] Sends SYNC_ACK message
3. [SoftPhone] Sends INITIALIZED message with login state and optionally widget size

After this point, the messages can be exchanged between the soft phone widget and HubSpot.

Note that the SYNC message sent repeatedly until it receives a response from the iFrame to account for slow loading call widgets.

### Outbound call

The following messages are exchanged when user initiates a call -

1. [HubSpot] Sends DIAL_NUMBER message with phone_number to dial
2. [SoftPhone] Sends the OUTGOING_CALL_STARTED message with the phone number that is dialed
3. [SoftPhone] Sends the CALL_ANSWERED message
4. [SoftPhone] Sends the CALL_ENDED message

### Incoming call

The following messages are exchanged for an incoming call -

1. [SoftPhone] Sends the INCOMING_CALL message with caller information
2. [SoftPhone] Sends the CALL_ANSWERED message
3. [SoftPhone] Sends the CALL_ENDED message

# Getting Started

## Register you calling extensions

TBD - Register the calling application and the calling extensions

## Integrate Calling Extensions SDK

### Get the Calling Extension SDK

Download the SDK using npm or yarn

```shell
npm install -s @hubspot/calling-extensions-sdk
```

### Using the Calling Extension SDK

The Calling Extension SDK exposes a simple API for HubSpot and a Soft Phone to exchange messages. The messages are sent as a method call and received through eventHandlers.

#### Create an instance

```js
import CallingExtensions from '@hubspot/calling-extensions-sdk';

const options = {
  // Whether to log various inbound/outbound messages to console
  debugMode: true | false,
  // eventHandlers handle inbound messages
  eventHandlers: {
    onDialNumber: event => {},
    onVisibilityChanged: event => {}
  }
};

const CallingExtensions = new CallingExtensions(options);
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
  CallingExtensions.initialized(payload);
  ```

- LOGGED_IN

  Sends a message indicating that user has logged in

  ```js
  CallingExtensions.userLoggedIn();
  ```

- LOGGED_OUT

  Sends a message indicating that user has logged out

  ```js
  CallingExtensions.userLoggedOut();
  ```

- INCOMING_CALL

  Sends a message to notify HubSpot of an incoming call.

  Note that the incoming calling is not yet supported across HubSpot. If the widget is active, this method will ensure that the widget is made visible.

  ```js
  const callInfo = { phoneNumber: string };
  CallingExtensions.incomingCall(callInfo);
  ```

- OUTGOING_CALL_STARTED

  Sends a message to notify HubSpot that an outgoing call has started.

  ```js
  const callInfo = { phoneNumber: string };
  CallingExtensions.outgoingCall(callInfo);
  ```

  - CALL_ANSWERED

  Sends a message to notify HubSpot that an outgoing call is being answered.

  ```js
  CallingExtensions.callAnswered();
  ```

  - CALL_ENDED

  Sends a message to notify HubSpot that the call has ended.

  ```js
  CallingExtensions.callEnded();
  ```

- RESIZE_WIDGET

  Sends a message to resize the iFrame

  ```js
  const newSize = { width: number, height: number };
  CallingExtensions.resizeWidget(newSize);
  ```

- CALL_DATA

  Sends a message transferring the engagementId

  ```js
  const data = {
    // engagementId of the engagement created for this call (inbound or outbound)
    engagementId: number
  };
  CallingExtensions.sendCallData(data);
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

  Handler for visibility change event.

  ```js
    onVisibilityChanged(data) {
        const { isMinimized, isHidden } = data;
        ...
    }
  ```

### Running the demo Calling Extension Widget project

The calling extensions are enabled for any portal that is starter or above.

#### Build the demo widget project

```shell
# install npm build dependencies and build the demo project
cd /demo
npm i
npm run build
```

#### Serve the demo widget

Easiest way to serve the demo widget is through running http-serve.

```shell
npm install -g http-serve 
# Create a temporary certificate to use for HTTPS
openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem
# cd into the demo folder
cd /demo
# Run the http server
http-serve -S -C cert.pem -o
```

Load the demo page in chrome and accept the invalid cert exception

#### Add local storage override for calling extensions

The calling widget settings are added during application creation in the developer portal. The following localstorage override is available for testing purposes -

localStorage.setItem('LocalSettings:Sales:CallingExtensions', '{"name": "Localhost", "url": "https://myWidgetUrl/path/"}')

#### Navigate to a contacts/company page and launch calling

The calling extension demo widget would load iFrame should load.

# Feedback

# License

TBD
