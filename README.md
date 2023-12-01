## Overview

[![calling-extensions-sdk on npm](https://img.shields.io/npm/v/@hubspot/calling-extensions-sdk.svg?style=flat-square)](http://npmjs.com/@hubspot/calling-extensions-sdk)

Calling Extensions SDK enables 3rd party VOIP providers or enterprise calling systems to seamlessly integrate their Computer Telephony Integration (CTI), also known as call widget, with HubSpot for outbound calling. The Call Widget is rendered inside the HubSpot UI, and a lightweight wrapper around the HTML5 postMessage API facilitates cross-origin communication between the widget and HubSpot.

## Getting Started

1. [Create a HubSpot app](https://developers.hubspot.com/docs/faq/how-do-i-create-an-app-in-hubspot) and [create a test account](https://developers.hubspot.com/docs/faq/how-do-i-create-a-test-account).
2. [Install](https://github.com/HubSpot/calling-extensions-sdk#install-the-calling-extensions-sdk-on-your-call-widget) the Calling Extensions SDK on your call widget. Alternatively, you can [run the demos](https://github.com/hubspot/calling-extensions-sdk#run-the-demos) if you'd like to see the SDK in action first.
3. Understand the [typical message flow between the call widget and HubSpot](https://github.com/HubSpot/calling-extensions-sdk#typical-message-flow-between-the-call-widget-and-hubspot).
4. Learn how to [use the Calling Extensions SDK](https://github.com/hubspot/calling-extensions-sdk#using-the-calling-extensions-sdk).
5. [Test](https://github.com/HubSpot/calling-extensions-sdk#test-your-app-from-a-local-environment) your app from a local environment.
6. [Get your app](https://github.com/HubSpot/calling-extensions-sdk#get-your-app-ready-for-production) ready for production.
7. [Publish your app](https://github.com/HubSpot/calling-extensions-sdk#publish-your-calling-app-to-the-hubspot-marketplace) to the HubSpot marketplace.

## Install the Calling Extensions SDK on your call widget

Add the Calling Extensions SDK as a [Node.js](https://nodejs.org/en/) dependency to your call widget:

- Using npm
```shell
npm i --save @hubspot/calling-extensions-sdk
```

- Using yarn
```shell
yarn add @hubspot/calling-extensions-sdk
```
## Run the Demos

We have installed the SDK on two demo apps to serve as examples:
- The [demo-minimal-js](https://github.com/HubSpot/calling-extensions-sdk/tree/project-demo-v1/demos/demo-minimal-js) features a minimal implementation of the SDK using JavaScript, HTML, and CSS. View how the SDK is instantiated in [index.js](https://github.com/HubSpot/calling-extensions-sdk/blob/project-demo-v1/demos/demo-minimal-js/index.js).
- The [demo-react-ts](https://github.com/HubSpot/calling-extensions-sdk/tree/project-demo-v1/demos/demo-react-ts) features a real-life implementation of the SDK using React, TypeScript, and Styled Components. Use it as a blueprint for your app! View how the SDK is instantiated in [useCti.ts](https://github.com/HubSpot/calling-extensions-sdk/blob/project-demo-v1/demos/demo-react-ts/src/hooks/useCti.ts).

Note that these demos aren't fully functional calling apps and use mock data to provide a more realistic experience.

### Installation

Install these demos on your local environment using the following steps, or skip to the next section to run the demos without installation.
1. Ensure that you have installed [Node.js](https://nodejs.org/en/) on your environment.
2. Clone, fork, or download the ZIP of this repository.
3. Open your terminal, navigate to the root directory of the project, and run one of the following commands:
- For the `demo-minimal-js`:
  ```shell
  cd demos/demo-minimal-js && npm i && npm start
  ```
- For the `demo-react-ts`:
  ```shell
  cd demos/demo-react-ts && npm i && npm start
  ```
  These will switch to the desired demo directory, install the [Node.js](https://nodejs.org/en/) dependencies required for the project using the [npm CLI](https://docs.npmjs.com/cli/v9), and start the app. Note that the `npm start` command will automatically open a new tab in your browser at https://localhost:9025/, and you may need bypass a "Your connection is not secure" warning in order to access the application.


### Launch the demo call widget from HubSpot

1. Navigate to a contact or company page within your HubSpot account.
2. Open your browser's developer console, and run one of the following:
- If you've installed the `demo-minimal-js` or the `demo-react-ts`:
  ```js
  localStorage.setItem("LocalSettings:Calling:installDemoWidget", "local");
  ```
- If you've skipped the installation steps, run one of the following:
  - For the `demo-minimal-js`:
    ```js
    localStorage.setItem("LocalSettings:Calling:installDemoWidget", "app:js");
    ```
  - For the `demo-react-ts`:
    ```js
    localStorage.setItem("LocalSettings:Calling:installDemoWidget", "app");
    ```
3. Refresh the page and click the "Make a phone call" button on the left toolbar to open the calling settings popover.
4. In the calling settings popover, click on "Open call options", locate the Calling Provider options, and select the name of the widget from step #2 ("Demo Widget Local", "Demo Widget JS", or "Demo Widget React").
5. You can now click on the "Call" button to see how the demo widget integrates with HubSpot via the Calling Extensions SDK. You can also see the events logged to your browser's developer console!

## Typical message flow between the call widget and HubSpot

The Calling Extensions SDK exposes a simple API for HubSpot and a Call Widget to exchange messages. The messages are sent through methods exposed by the SDK and received through eventHandlers.

### Initializing the call widget

The following messages are exchanged when a call widget is instantiated:

![Image description](./docs/images/InitializeCallWidgetIFrame.png)

In order to initialize the call widget, the Calling Extensions SDK executes a SYNC/SYNC_ACK routine where Hubspot repeatedly sends a SYNC message to the widget once the iFrame is loaded until it receives the SYNC_ACK response from the widget. If the SYNC_ACK response is not received within 30 seconds, the widget initialization is marked as failed. Otherwise, the ready event is triggered to mark that HubSpot and the call widget are synchronized and can now exchange messages (events). Therefore, the call widget should wait for the ready event from the SDK and send the initialized event to HubSpot.

### Outbound call

The following messages are exchanged when user initiates a call:

![Image description](./docs/images/OutboundCallSequenceDiagram.png)

Hubspot ensures the call widget is logged in before sending in a dial number event - if the widget is not logged in, an alert is shown in HubSpot's UI.

Here is a description of the events:

1. **Dial number** - HubSpot sends the dial number event.
2. **Outbound call started** - Widget notifies HubSpot when the call is started.
3. **Create engagement** - HubSpot creates [a call engagement](https://developers.hubspot.com/docs/api/crm/calls) with minimal information if requested by the widget.
4. **Engagement created** - HubSpot created an engagement.
5. **EngagementId sent to Widget** - HubSpot sends the engagementId to the widget.
6. **Call ended** - Widget notifies when the call is ended.
7. **Call completed** - Widget notifies when the user is done with the widget user experience.
8. **Update engagement** - Widget fetches the engagement by the engagementId, then merges and updates the engagement with additional call details. Visit the HubSpot Developer Docs to learn more about [updating a call engagement](https://developers.hubspot.com/docs/api/crm/calls#update-calls).

## Using the Calling Extensions SDK

### Create an instance

```js
import CallingExtensions from "@hubspot/calling-extensions-sdk";

const options = {
  /** @property {boolean} debugMode - Whether to log various inbound/outbound debug messages to the console. If false, console.debug will be used instead of console.log */
  debugMode: boolean,
  // eventHandlers handle inbound messages
  eventHandlers: {
    onReady: () => {
      /* HubSpot is ready to receive messages. */
    },
    onDialNumber: event => {
      /* HubSpot sends a dial number from the contact */
    },
    /** onEngagementCreated will be @deprecated in 2024 */
    onEngagementCreated: event => {
      /* HubSpot has created an engagement for this call. */
    },
    onCreateEngagementSucceeded: event => {
      /* HubSpot has created an engagement for this call. */
    }
    onEngagementCreatedFailed: event => {
      /* HubSpot has failed to create an engagement for this call. */
    }
    onUpdateEngagementSucceeded: event => {
      /* HubSpot has updated an engagement for this call. */
    },
    onUpdateEngagementFailed: event => {
      /* HubSpot has failed to update an engagement for this call. */
    },
    onCallerIdMatchSucceeded: event => {
      /* HubSpot has fetched caller id matches for this call. */
    },
    onCallerIdMatchFailed: event => {
      /* HubSpot has failed to fetch caller id matches for this call. */
    }
    onVisibilityChanged: event => {
      /* Call widget's visibility is changed. */
    }
  }
};

const extensions = new CallingExtensions(options);
```

### Sending messages to HubSpot

:warning: _Wait for the onReady event before sending sending any messages to HubSpot._

<details>
 <summary>initialized </summary>
 <p>

```ts
// Sends a message indicating that the soft phone is ready for interaction.
const payload = {
  // Whether a user is logged-in
  isLoggedIn: boolean,
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

```ts
// Sends a message to notify HubSpot that an outgoing call has started.

const callInfo = {
  phoneNumber: string, // optional unless call is initiated by the widget
  createEngagement: boolean, // whether HubSpot should create an engagement for this call
  callStartTime: number // optional unless call is initiated by the widget
};
extensions.outgoingCall(callInfo);
```

</p>
</details>

<details>
 <summary>incomingCall</summary>
 <p>

```ts
// Sends a message to notify HubSpot that an outgoing call has started.

const callInfo = {
  fromNumber: string, // Required: The caller's number
  toNumber: string, // Required: The recipient's number
  createEngagement: boolean, // Whether HubSpot should create an engagement for this call
};
extensions.incomingCall(callInfo);
```

</p>
</details>

<details>
 <summary>navigateToRecord</summary>
 <p>

```ts
// Sends a message to notify HubSpot that we need to navigate to a record page for a caller id match.
type ObjectCoordinates = {
  portalId: number;
  objectTypeId: string;
  objectId: number;
}

extensions.navigateToRecord({ objectCoordinates });
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

```ts
// Sends a message to notify HubSpot that the call has completed.
// After receiving the call completed event, HubSpot will
//   1) insert the engagement into the timeline
//   2) set the default associations on the engagement
//   3) closes the the widget unless `hideWidget` is set to false.
//   4) update the engagement with any engagement properties
const data = {
  engagementId: number,
  hideWidget: boolean, // (optional) defaults to true
  engagementProperties?: { [key: string]: string } // https://developers.hubspot.com/docs/api/crm/calls#properties
};
extensions.callCompleted(data);
```

</p>
</details>

<details>
 <summary>sendError</summary>
 <p>

```ts
// Sends a message to notify HubSpot that the call widget has encountered an error.
// After receiving the sendError event, HubSpot will display an alert popup to the user with the error message provided.
const data = {
  message: string // error message to be displayed in the alert popup
};
extensions.sendError(data);
```

</p>
</details>

<details>
 <summary>resizeWidget</summary>
 <p>

```ts
// Sends a message to notify HubSpot that the call widget needs to be resized.
// After receiving the resizeWidget event, HubSpot will use the provided height and width to resize the call widget.
const data = {
  height: boolean // desired height of the call widget
  width: number, // desired width of the call widget
};
extensions.resizeWidget(data);
```

</p>
</details>

### Receiving messages from HubSpot

<details>
 <summary>onReady</summary>
 <p>

```ts
// Receive an engagementId for an existing inbound call
type Payload = {
  engagementId: number | undefined
}

// Message indicating that HubSpot is ready to receive messages
onReady(payload) {
    // Send initialized message to HubSpot to indicate that the call widget is also ready
    extensions.initialized(payload);
    if (payload.engagementId) {
      // Initialize calling state in the app for existing inbound call
      ...
    }
    ...
}
```

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
    /* The id of the hubspot account */
    portalId: number,
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
 <summary>onCreateEngagementSucceeded</summary>
 <p>

```js
  // Message indicating that HubSpot has created an engagement
  onCreateEngagementSucceeded(data) {
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
 <summary>onCreateEngagementFailed</summary>
 <p>

```js
  // Message indicating that HubSpot has failed to create an engagement
  onCreateEngagementFailed(data) {
    const {
      error: { message: string }
    } = data;
      ...
  }
```
</p>
</details>

<details>
 <summary>onUpdateEngagementSucceeded</summary>
 <p>

```js
  // Message indicating that HubSpot has updated an engagement
  onUpdateEngagementSucceeded(data) {
    const {
       /* updated engagement id. */
      engagementId: number,
    } = data;
      ...
  }
```
</p>
</details>

<details>
 <summary>onUpdateEngagementFailed</summary>
 <p>

```js
  // Message indicating that HubSpot has failed to update an engagement
  onUpdateEngagementFailed(data) {
    const {
      error: { message: string }
    } = data;
      ...
  }
```
</p>
</details>

<details>
 <summary>onCallerIdMatchSucceeded</summary>
 <p>

```js
  // Message indicating that HubSpot has updated an engagement
  onCallerIdMatchSucceeded(data) {
    const {
      callerIdMatches: (ContactIdMatch | CompanyIdMatch)[];
    } = data;
      ...
  }

  type ObjectCoordinates = {
    portalId: number;
    objectTypeId: string;
    objectId: number;
  }

  type ContactIdMatch = {
    callerIdType: 'CONTACT';
    objectCoordinates: ObjectCoordinates;
    firstName: string;
    lastName: string;
    email: string;
  }

  type CompanyIdMatch = {
    callerIdType: 'COMPANY';
    objectCoordinates: ObjectCoordinates;
    name: string;
  }
```
</p>
</details>

<details>
 <summary>onCallerIdMatchFailed</summary>
 <p>

```js
  // Message indicating that HubSpot has failed to update an engagement
  onCallerIdMatchFailed(data) {
    const {
      error: { message: string }
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

## Test your app from a local environment

While you're in the process of building your application, you can manually set the iframe URL for your browser by setting a localStorage value. This will allow you to set a localhost URL for local testing.

To set the value, open the developer tools for your browser, and run the following JavaScript command in the developer console:

```js
localStorage.setItem(
  "LocalSettings:Calling:CallingExtensions",
  '{"name": "<your intended widget name>", "url": "<your dev url or prod url>"}'
);
```

The name value will be the title that appears in the header of the calling widget, and the url will be the URL used for the iframe. While this item is set, the name you set will appear as an option for the call provider when you click the call icon, and the calling widget will use the iframe url you set.

## Get your app ready for production

In order to launch the calling extensions iFrame for end users, HubSpot requires the following iFrame parameters.

```js
{
  name: string /* The name of your calling service to display to users. */,
  url: string  /* The URL to your phone/calling UI, built with the Calling Extensions */,
  width: number /* The iFrame's width */,
  height: number /* The iFrame's height */,
  isReady: boolean /* Whether the widget is ready for users (default=true) */,
  supportsCustomObjects : true // indicate if calls can be placed from a custom object
}
```

Using your favorite API tool (postman/etc.), send this payload to our settings API. Please get the APP_ID of your calling widget application and your app [DEVELOPER_ACCOUNT_API_KEY](https://developers.hubspot.com/docs/api/developer-tools-overview#authentication)

```shell
# Example payload to add the call widget app settings
curl --request POST \
  --url 'https://api.hubapi.com/crm/v3/extensions/calling/APP_ID/settings?hapikey=DEVELOPER_ACCOUNT_API_KEY' \
  --header 'accept: application/json' \
  --header 'content-type: application/json' \
  --data '{"name":"demo widget","url":"https://mywidget.com/widget","height":600,"width":400,"isReady":true}'

# Note that this endpoint also support GET and DELETE
```

The isReady flag indicate whether the widget is ready for production. This flag should be set to false during testing. Note that this flag (or any other field) can be overwritten through localStorage.

```js
/**
 * Override the isReady flag for the call widget
 */
localStorage.setItem(
  "LocalSettings:Calling:CallingExtensions",
  '{"name": "<your intended widget name>", "isReady": true}'
);
```

## Publish your calling app to the HubSpot marketplace

The final step once your app is setup is to list your calling app in the HubSpot marketplace. You can find more details [here](https://developers.hubspot.com/submit-an-application-to-the-marketplace) . You can also choose to not list it in the marketplace if this application is for your internal use only.

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

<details>
 <summary> What scopes are required as a part of the integration?</summary>
 <p>
    Add contacts and timeline scopes. These scopes ensure your application has access to contacts and the ability to create and update call engagements in the CRM.
</p>
</details>

<details>
 <summary> Can this functionality be added to an already existing application in the marketplace or do I create a new app? </summary>
 <p>
    If you already have an existing app that serves the calling use case then you can directly add this functionality to your existing app. All customers who already have your app installed with get access to this new functionality without having to install the app again. </p>
</details>

<details>
 <summary> Can I integrate my existing soft phone application in the SDK? </summary>
 <p>
    Yes, integrating your existing soft phone application should be very easy. Just follow the steps in the documentation above to have your application up and running. </p>
</details>

<details>
 <summary> Does the SDK support inbound calling? </summary>
 <p>
    The current SDK does not support inbound calling. We understand this is a big feature request and will have more to share about our plans for inbound calling in the future. </p>
</details>

<details>
 <summary> How can users install the integration? </summary>
 <p>
    Users can install the app is one of two ways 1) Search for the app in the HubSpot Marketplace and follow the steps 2) If the app is not listed in the marketplace, they can install it by clicking on the OAuth URl (can be found in your developer portal under app settings). Users can find directions in our knowledge base article <a href="https://knowledge.hubspot.com/calling/integrate-a-third-party-calling-provider-with-hubspot" target="_blank">here</a></p>
</details>

<details>
 <summary> Once installed, how can users access the app integration? </summary>
 <p>
    Once the app is installed users can access the app by going to any record in the HubSpot CRM and clicking on the call button. Users will then be presented an option to use the installed calling integration or even switch to native HubSpot calling functionality if needed. </p>
</details>

<details>
 <summary> Can users use multiple integrations at the same time? </summary>
 <p>
    Yes, users can use multiple 3rd party calling integrations at the same time. They can use the provider switcher presented after clicking on the call button to seamlessly switch between providers. </p>
</details>

<details>
 <summary> Can free users install app integrations? </summary>
 <p>
    Yes, users will be able to install the app. </p>
</details>

<details>
 <summary> If a user already has my app installed, does the integration automatically show up? </summary>
 <p>
    Yes, if a user already has installed your app, and you are updating the same app with the calling extensions the integration will automatically show up. Currently, there is no way for the developer to enable the call widget only to a subset of customers.</p>
</details>

<details>
 <summary> Can any user install or uninstall an app? </summary>
 <p>
    No. Only users who have necessary permissions can install and uninstall an app. These permissions can be found in HubSpot portal settings page in the "Users & Teams" tab. </p>
</details>

<details>
  <summary>Can I place a call from a custom object?</summary>
  <p>Yes, calling integrations can now place calls from custom objects as long as they only use the SDK to create the call. In order to take advantage of these improvements, each integration will need to verify that they only use the Calling SDK to create calls and to notify HubSpot in the outgoingCall event.</p>

  <p>1. Verify that the integration is using the Calling SDK to create engagements in the outgoingCall event:</p>

  ```js
outgoingCall({ createEngagement: true })
```

  <p>2. If createEngagements is true, update your widget infomation following these instructions(https://github.com/HubSpot/calling-extensions-sdk/#get-your-app-ready-for-production):</p>


<p>Here is the example for the entire outgoingCall event</p>

```js
const callInfo = {
  phoneNumber: string, // optional unless call is initiated by the widget
  createEngagement: boolean // whether HubSpot should create an engagement for this call
  callStartTime: number // optional unless call is initiated by the widget
};
extensions.outgoingCall(callInfo);
```
</details>

<details>
 <summary> Need help with the SDK? </summary>
 <p>
    Head over to the <a href="https://community.hubspot.com/t5/APIs-Integrations/bd-p/integrations" target="_blank">HubSpot developer support forum</a> and post your questions where our community can assist in helping you achieve your goals. </p>
</details>
