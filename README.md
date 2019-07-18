## Overview

[![Build Status](https://travis-ci.org/HubSpot/calling-extensions-sdk.svg?branch=master)](https://travis-ci.org/HubSpot/calling-extensions-sdk)
[![calling-extensions-sdk on npm](https://img.shields.io/npm/v/@hubspot/calling-extensions-sdk.svg?style=flat-square)](http://npmjs.com/@hubspot/calling-extensions-sdk)

Calling Extension SDK enables an integrated end user calling experience for both outbound and inbound calling. A 3rd party web based call widget is rendered inside HubSpot UI and a lightweight wrapper around HTML5 postMessage API facilitates cross-origin communication between the call widget and HubSpot.

## Getting Started

1. [Create](https://developers.hubspot.com/docs/faq/how-do-i-create-an-app-in-hubspot) a HubSpot application.
2. Integrate with the [Engagement API](https://developers.hubspot.com/docs/methods/engagements/engagements-overview) to log calls to the timeline.
3. [Request access](https://developers.hubspot.com/calling-extensions-sdk) to the Calling Extensions SDK (Beta).
4. [Integrate](https://github.com/HubSpot/calling-extensions-sdk#integrate-calling-extensions-sdk) the Calling Extension SDK with your call widget.
5. Send the call widget settings ({url: prodctionWidgetURL, height: number, width: number}) to HubSpot; we'll add these settings to your HubSpot application.

Once your application is added to the HubSpot portal, all outbound call will be handled by your softphone widget.

## Development

LocalStorage can be used to test the widget hosted locally or in staging environment. In your Hubspot testing application open the devtools console and add the item to your localstorage:

```js
localStorage.setItem(
  "LocalSettings:Sales:CallingExtensions",
  '{"name": "Localhost", "url": "https://myWidgetUrl/path/"}'
);
```

On calling one of your contacts the widget will appear, with the iframe loaded inside it.

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
import CallingExtensions from "@hubspot/calling-extensions-sdk";

const options = {
  // Whether to log various inbound/outbound messages to console
  debugMode: true | false,
  // eventHandlers handle inbound messages
  eventHandlers: {
    onReady: () => {
      /* HubSpot is ready to receive messages. */
    },
    onDialNumber: event => {
      /* Dial a number */
    },
    onVisibilityChanged: event => {
      /* Call widget's visibility is changed. */
    }
  }
};

const CallingExtensions = new CallingExtensions(options);
```

#### Sending the messages to HubSpot

The messages are sent to HubSpot through method calls. Following is a list of messages that can be sent to HubSpot.

_Wait for the onReady event before sending sending any messages to HubSpot._

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

#### Handling a message sent from HubSpot to the soft phone

- Dial Number

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

- Default event handler

  Default handler for events. Will match all events without handlers.

  ```js
    defaultEventHandler(event) {
        console.info("Event received. Do you need to handle it?", event);
    }
  ```

### Running the demo Calling Extension Widget project

The calling extensions are enabled for any portal that is starter or above.

#### Run the demo widget project

```shell
# install npm build dependencies and start the demo project
cd /demo
npm i
npm start
```

Load the demo page in chrome and accept the invalid cert exception

#### Add local storage override for calling extensions

Add the following localstorage override for testing purposes -

localStorage.setItem('LocalSettings:Sales:CallingExtensions', '{"name": "Localhost", "url": "https://localhost:9025/"}')

#### Navigate to a contacts/company page and launch call

The calling extension demo widget should load inside an iFrame.

## Typical message flow between the call widget and HubSpot

### Loading the call widget

The following messages are exchanged when a call widget is instantiated -

1. [HubSpot] Sends a SYNC message
2. [SoftPhone] Sends SYNC_ACK message
3. [SoftPhone] Sends INITIALIZED message with login state and optionally widget size

At this point, the messages can be exchanged between the call widget and HubSpot.

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

# Feedback

# License

TBD
