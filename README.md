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

The following LocalStorage setting can be used to test the widget hosted locally or in staging environment.

```js
// Execute the following command in the browsers debug console
localStorage.setItem(
  "LocalSettings:Sales:CallingExtensions",
  '{"name": "Demo widget", "url": "https://myWidgetUrl/path/"}'
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

The Calling Extension SDK exposes a simple API for HubSpot and a Soft Phone to exchange messages. The messages are sent through methods exposed by SDK and received through eventHandlers.

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

const extensions = new CallingExtensions(options);
```

#### Sending the messages to HubSpot

:warning: _Wait for the onReady event before sending sending any messages to HubSpot._

<details>
 <summary>initialized </summary>
 <p>

```js
// Sends a message indicating that the soft phone is ready for interaction.
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

extensions.initialized(payload);

```

 </p>
</details>

<details>
 <summary>userLoggedIn </summary>
 <p>

```js
// Sends a message indicating that user has logged in
// This message is only needed when user isn't loged in when initialized
extensions.userLoggedIn();
```

</p>
</details>

<details>
 <summary>userLoggedOut</summary>
 <p>

```js
// Sends a message indicating that user has logged out
extensions.userLoggedOut();
```

</p>
</details>

<details>
 <summary>outgoingCall</summary>
 <p>

```js
// Sends a message to notify HubSpot that an outgoing call has started.
// This is a case where a user dials a number directly throught the call widget.
const callInfo = { phoneNumber: string };
extensions.outgoingCall(callInfo);
```

</p>
</details>

<details>
 <summary>callAnswered</summary>
 <p>

Sends a message to notify HubSpot that an outgoing call is being answered.

```js
extensions.callAnswered();
```

</p>
</details>

<details>
 <summary>callEnded</summary>
 <p>

```js
// Sends a message to notify HubSpot that the call has ended.
// After receiving the call ended event, the user can navigate away, can close the call widget.
extensions.callEnded();
```

</p>
</details>

<details>
 <summary>callCompleted</summary>
 <p>

```js
// Sends a message to notify HubSpot that the call has completed.
// After receiving the call completed event, HubSpot will
//   1) insert the engagement into the timeline
//   2) set the default associations on the engagement
const data = { engagementId: number };
extensions.callCompleted(data);
```

</p>
</details>

<details>
 <summary>resizeWidget</summary>
 <p>

```js
// Sends a message to HubSpot to resize the iFrame
const newSize = { width: number, height: number };
extensions.resizeWidget(newSize);
```

</p>
</details>

#### Receiving messages from HubSpot

</p>
</details>

<details>
 <summary>onDialNumber</summary>
 <p>

```js
// Message indicating that user has triggered an outbound call
onDialNumber(data) {
  const {
    /* The phone nubmer to dial */
    phoneNumber: string,
    /* The id of the logged in user.   */
    ownerId: number,
    /* HubSpot object Id of the phoneNumber */
    objectId: number,
    /* HubSpot  object type of the phoneNumber */
    objectType: CONTACT | COMPANY
   } = data;
    ...
  }
```

</p>
</details>

<details>
 <summary>onVisibilityChanged</summary>
 <p>

```js
  // Message indicating if user has minimized/hide the call widget
  onVisibilityChanged(data) {
    const { isMinimized, isHidden } = data;
    ...
  }
```

</p>
</details>

<details>
 <summary>defaultEventHandler</summary>
 <p>

```js
  // Default handler for events.
  defaultEventHandler(event) {
    console.info("Event received. Do you need to handle it?", event);
  }
```

</p>
</details>

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

```js
localStorage.setItem(
  "LocalSettings:Sales:CallingExtensions",
  '{"name": "Demo widget", "url": "https://localhost:9025/"}'
);
```

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

# Feedback

# License

TBD
