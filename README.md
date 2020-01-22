## Overview

[![Build Status](https://travis-ci.org/HubSpot/calling-extensions-sdk.svg?branch=master)](https://travis-ci.org/HubSpot/calling-extensions-sdk)
[![calling-extensions-sdk on npm](https://img.shields.io/npm/v/@hubspot/calling-extensions-sdk.svg?style=flat-square)](http://npmjs.com/@hubspot/calling-extensions-sdk)

Calling Extension SDK enables an integrated end user calling experience for outbound calling. A 3rd party web based call widget is rendered inside HubSpot UI and a lightweight wrapper around HTML5 postMessage API facilitates cross-origin communication between the call widget and HubSpot.

## Getting Started

1. [Create](https://developers.hubspot.com/docs/faq/how-do-i-create-an-app-in-hubspot) a HubSpot application.
2. Integrate with the [Engagement API](https://developers.hubspot.com/docs/methods/engagements/engagements-overview) to log calls to the timeline.
3. [Request access](https://developers.hubspot.com/calling-extensions-sdk) to the Calling Extensions SDK (Beta).
4. [Integrate](https://github.com/HubSpot/calling-extensions-sdk#integrate-calling-extensions-sdk) the Calling Extension SDK with your call widget.
5. Send the call widget settings ({name: integrationName, url: prodctionWidgetURL, height: number, width: number}) to HubSpot; we'll add these settings to your HubSpot application.
6. Publish the application to marketplace.

Once the administrator installs the call application to a HubSpot portal, it will show up as an option to start an outbound call.

## Integrate Calling Extensions SDK

### Get the Calling Extension SDK

Download the SDK using npm or yarn

```shell
npm install -s @hubspot/calling-extensions-sdk
```

#### Running the demo Calling Extension Widget project

##### Run the demo widget project

```shell
# install npm build dependencies and start the demo project
# The following commands will automatically start the browser on the demo page.
cd /demo
npm start
```

##### Add local storage override for calling extensions

```js
// Add the following localstorage override for demo widget
localStorage.setItem(
  "LocalSettings:Sales:CallingExtensions",
  '{"name": "Demo widget", "url": "https://localhost:9025/"}'
);
```

##### Launch the demo widget from HubSpot

Navigate to the a contact/company page in HubSpot and launch calling, the demo widget should load inside an iFrame.

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
    onEngagementCreated: event => {
      /* HubSpot has created an engagement for this call. */
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
  sizeInfo: {
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

const callInfo = {
  phoneNumber: string, // optional unless call is initiated by the widget
  createEngagement: true // whether HubSpot should create an engagement for this call
};
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
 <summary>onEngagementCreated</summary>
 <p>

```js
  // Message indicating that HubSpot has created
  onEngagementCreated(data) {
    const {
      /* A HubSpot created engagement id. */
      engagementId: number,
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

## Typical message flow between the call widget and HubSpot

### Initializing the call widget

The following messages are exchanged when a call widget is instantiated.
![Image description](./docs/images/InitializeCallWidgetIFrame.png)
Once the widget iFrame is created, Hubspot send the SYNC message to the widget after iFrame is loaded and repetedly send this message until it receives the SYNC_ACK response from the widget. If the SYNC_ACK response isn't received within 30 seconds, the widget is marked as failed. Note that sending SYNC/SYNC_ACK messages are handled by the framework. Once the widget and host page are synchronized, the frameworks triggers the ready event.

The call widget should waits for the ready event from the framework and send the initialized event to HubSpot. At this point, the messages can be exchanged between the call widget and HubSpot.

### Outbound call

The following messages are exchanged when user initiates a call.
![Image description](./docs/images/OutboundCallSequenceDiagram.png)
Hubspot ensures the call widget is logged in before sending in a dial number event - if the widget is not logged in, an alert is shown in HubSpot's UI.

Here is description of events:

1. **Dial number** - HubSpot sends the dial number event.
2. **Outbound call started** - Widget notifies HubSpot when the call is started.
3. **Create engagement** - HubSpot creates an engagement with minimum information if requested by the widget.
4. **Engagement created** - HubSpot creates an engagement.
5. **Engagement created** - HubSpot sends the engagementId to the widget.
6. **Call ended** - Widget notifies when call is ended.
7. **Call completed** - Widget notifies when user is done with the widget user experience.
8. **Update engagement** - Widget fetches the engagment by the engagementId, merges and updates the engagement with additional call details. [Call engagement overview](https://developers.hubspot.com/docs/methods/engagements/engagements-overview), [Docs on updating the engagement](https://developers.hubspot.com/docs/methods/engagements/update_engagement-patch)

# FAQs

### App

<details>
 <summary>How is user authentication handled?</summary>
 <p>
    The call widget should handle authentication.
</p>
</details>

<details>
 <summary>Is Calling Extensions hosted on a CDN?</summary>
 <p>
    No. The calling entensions is very small and should be bundled with the call widget.  If bundling the file is not possible, the npm package includes a compiled UMD bundle that can be included into HTML (../node_modules/@hubspot/calling-extensions-sdk/dist/main.js).
</p>
</details>

<details>
 <summary>When an engagement should be created vs updated.</summary>
 <p>
    A user can initiate a call from inside the HubSpot UI and outside of the HubSpot UI (e.g. mobile app/redirected number/etc.)  If a call is initiated from within HubSpot UI, HubSpot will create a call engagement and send the engagement to the call widget.  Once the call finishes, the call widget can update this engagement with additional call details.  If a call is initiated outside of HubSpot UI, the widget should create the call engagement. 
</p>
</details>

# Feedback

# License

TBD
