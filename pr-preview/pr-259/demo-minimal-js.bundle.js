/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(self, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   addOnMessageHandler: () => (/* binding */ addOnMessageHandler),\n/* harmony export */   answerCall: () => (/* binding */ answerCall),\n/* harmony export */   completeCall: () => (/* binding */ completeCall),\n/* harmony export */   endCall: () => (/* binding */ endCall),\n/* harmony export */   incomingCall: () => (/* binding */ incomingCall),\n/* harmony export */   initialize: () => (/* binding */ initialize),\n/* harmony export */   logIn: () => (/* binding */ logIn),\n/* harmony export */   logOut: () => (/* binding */ logOut),\n/* harmony export */   outgoingCall: () => (/* binding */ outgoingCall),\n/* harmony export */   publishToChannel: () => (/* binding */ publishToChannel),\n/* harmony export */   resizeWidget: () => (/* binding */ resizeWidget),\n/* harmony export */   sendError: () => (/* binding */ sendError),\n/* harmony export */   setWidgetUrl: () => (/* binding */ setWidgetUrl),\n/* harmony export */   state: () => (/* binding */ state),\n/* harmony export */   userAvailable: () => (/* binding */ userAvailable),\n/* harmony export */   userUnavailable: () => (/* binding */ userUnavailable)\n/* harmony export */ });\n/* harmony import */ var _hubspot_calling_extensions_sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @hubspot/calling-extensions-sdk */ \"./node_modules/@hubspot/calling-extensions-sdk/dist/main.esm.js\");\n/* harmony import */ var uuid__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! uuid */ \"./node_modules/uuid/dist/esm-browser/v4.js\");\n/* eslint-disable no-undef */\n\n// import CallingExtensions, { Constants } from \"../../index\";\n\nconst { messageType, callEndStatus } = _hubspot_calling_extensions_sdk__WEBPACK_IMPORTED_MODULE_0__.Constants;\n\nfunction getQueryParam(param) {\n  const urlParams = new URLSearchParams(window.location.search);\n  return urlParams.get(param);\n}\n\nconst bc = new BroadcastChannel(\"calling-extensions-demo-minimal-js\");\n\nconst state = {\n  externalCallId: \"\",\n  engagementId: 0,\n  fromNumber: \"+18884827768\",\n  incomingContactName: \"\",\n  toNumber: \"+442073238299\",\n  userAvailable: false,\n  userId: 0,\n  enforceButtonsOrder: false,\n  ownerId: 0,\n  usesCallingWindow: getQueryParam(\"usesCallingWindow\") !== \"false\",\n  iframeLocation: getQueryParam(\"iframeLocation\") || \"widget\",\n};\n\nconst sizeInfo = {\n  width: 400,\n  height: 650,\n};\n\n/** Button IDs */\nconst ANSWER_CALL = \"answercall\";\nconst COMPLETE_CALL = \"completecall\";\nconst END_CALL = \"endcall\";\nconst INCOMING_CALL = \"incomingcall\";\nconst INITIALIZE = \"initialize\";\nconst LOG_IN = \"login\";\nconst LOG_OUT = \"logout\";\nconst OUTGOING_CALL = \"outgoingcall\";\nconst RESIZE_WIDGET = \"resizewidget\";\nconst SEND_ERROR = \"senderror\";\nconst USER_AVAILABLE = \"useravailable\";\nconst USER_UNAVAILABLE = \"userunavailable\";\n\nfunction toSnakeUpperCase(type) {\n  if (type === INCOMING_CALL) {\n    return \"INCOMING_CALL\";\n  }\n  return type.toUpperCase();\n}\n\nfunction disableButtons(ids) {\n  if (!state.enforceButtonsOrder) {\n    return;\n  }\n  ids.forEach(id => {\n    document.querySelector(`#${id}`).setAttribute(\"disabled\", true);\n  });\n}\n\nfunction enableButtons(ids) {\n  if (!state.enforceButtonsOrder) {\n    return;\n  }\n  ids.forEach(id => {\n    document.querySelector(`#${id}`).removeAttribute(\"disabled\");\n  });\n}\n\nfunction addOnMessageHandler() {\n  bc.onmessage = ({ data }) => {\n    console.log(\n      \"Received broadcast message from window:\",\n      toSnakeUpperCase(data.type),\n      data.payload,\n    );\n\n    if (data.type === INCOMING_CALL) {\n      // eslint-disable-next-line no-use-before-define\n      incomingCall(data.payload);\n    }\n  };\n}\n\nconst cti = new _hubspot_calling_extensions_sdk__WEBPACK_IMPORTED_MODULE_0__[\"default\"]({\n  debugMode: true,\n  eventHandlers: {\n    // eslint-disable-next-line object-curly-newline\n    onReady: ({\n      portalId,\n      userId,\n      ownerId,\n      usesCallingWindow,\n      iframeLocation,\n      hostUrl,\n    } = {}) => {\n      cti.initialized({\n        isLoggedIn: false,\n        isAvailable: false,\n        sizeInfo,\n      });\n      disableButtons([\n        INITIALIZE,\n        USER_AVAILABLE,\n        USER_UNAVAILABLE,\n        OUTGOING_CALL,\n        INCOMING_CALL,\n        ANSWER_CALL,\n        END_CALL,\n        COMPLETE_CALL,\n        LOG_OUT,\n      ]);\n      enableButtons([LOG_IN, SEND_ERROR, RESIZE_WIDGET]);\n      if (portalId) {\n        state.portalId = portalId;\n      }\n      if (userId) {\n        state.userId = userId;\n      }\n      if (ownerId) {\n        state.ownerId = ownerId;\n      }\n\n      if (iframeLocation) {\n        state.iframeLocation = iframeLocation;\n      }\n\n      if (hostUrl && usesCallingWindow === false) {\n        state.usesCallingWindow = false;\n\n        const hostUrl = \"https://app.hubspotqa.com/\";\n        const url = `${hostUrl}/calling-integration-popup-ui/${portalId}?usesCallingWindow=false`;\n\n        document\n          .querySelector(\".openwindow\")\n          .children[0].setAttribute(\"href\", url);\n\n        document.querySelector(\".openwindow\").setAttribute(\"display\", \"block\");\n\n        addOnMessageHandler();\n      }\n    },\n    onDialNumber: (data, rawEvent) => {\n      const { phoneNumber } = data;\n      state.toNumber = phoneNumber;\n    },\n    onEngagementCreated: (data, rawEvent) => {\n      const { engagementId } = data;\n      state.engagementId = engagementId;\n    },\n    onEndCall: () => {\n      window.setTimeout(() => {\n        cti.callEnded();\n      }, 500);\n    },\n    onVisibilityChanged: (data, rawEvent) => {\n      /** The cti's visibility has changed. */\n    },\n    onCreateEngagementSucceeded: (data, rawEvent) => {\n      const { engagementId } = data;\n      state.engagementId = engagementId;\n    },\n    onCreateEngagementFailed: (data, rawEvent) => {\n      /** HubSpot was unable to create an engagement for this call. */\n    },\n    onUpdateEngagementSucceeded: (data, rawEvent) => {\n      const { engagementId } = data;\n      state.engagementId = engagementId;\n    },\n    onUpdateEngagementFailed: (data, rawEvent) => {\n      /** HubSpot was unable to update the engagement for this call. */\n    },\n    onCallerIdMatchSucceeded: (data, rawEvent) => {\n      const { callerIdMatches } = data;\n      if (callerIdMatches.length) {\n        const firstCallerIdMatch = callerIdMatches[0];\n        if (firstCallerIdMatch.callerIdType === \"CONTACT\") {\n          state.incomingContactName = `${firstCallerIdMatch.firstName} ${firstCallerIdMatch.lastName}`;\n        } else if (firstCallerIdMatch.callerIdType === \"COMPANY\") {\n          state.incomingContactName = firstCallerIdMatch.name;\n        }\n        cti.logDebugMessage({\n          message: `Incoming call from ${state.incomingContactName} ${state.fromNumber}`,\n          type: `${callerIdMatches.length} Caller ID Matches`,\n        });\n        cti.navigateToRecord({\n          objectCoordinates: firstCallerIdMatch.objectCoordinates,\n        });\n        return;\n      }\n      cti.logDebugMessage({\n        message: `Incoming call from ${state.fromNumber}`,\n        type: \"No Caller ID Matches\",\n      });\n    },\n    onCallerIdMatchFailed: (data, rawEvent) => {\n      cti.logDebugMessage({\n        message: `Incoming call from ${state.fromNumber}`,\n        type: \"Caller ID Match Failed\",\n      });\n    },\n    onNavigateToRecordFailed: (data, rawEvent) => {\n      /** HubSpot was unable to navigate to the desired record page. */\n    },\n    onPublishToChannelFailed: (data, rawEvent) => {\n      /** HubSpot was unable to publish the call to the connected channel. */\n    },\n    onPublishToChannelSucceeded: (data, rawEvent) => {\n      /** HubSpot successfully published the call to the connected channel. */\n    },\n    onSetWidgetUrlFailed: (data, rawEvent) => {\n      /** HubSpot was unable to change the widget iframe src URL. */\n    },\n  },\n});\n\nfunction setWidgetUrl() {\n  // Redirect to a new URL\n  const newUrl =\n    \"https://github.hubspot.com/calling-extensions-sdk/demo-minimal-js.html\";\n  cti.setWidgetUrl({ iFrameUrl: newUrl });\n}\n\nfunction initialize() {\n  cti.initialized({\n    isLoggedIn: false,\n  });\n  disableButtons([\n    INITIALIZE,\n    USER_AVAILABLE,\n    USER_UNAVAILABLE,\n    OUTGOING_CALL,\n    INCOMING_CALL,\n    ANSWER_CALL,\n    END_CALL,\n    COMPLETE_CALL,\n    LOG_OUT,\n  ]);\n  enableButtons([LOG_IN, SEND_ERROR, RESIZE_WIDGET]);\n}\n\nfunction logIn() {\n  cti.userLoggedIn();\n  disableButtons([LOG_IN, INITIALIZE]);\n  enableButtons([LOG_OUT, OUTGOING_CALL]);\n  if (state.userAvailable) {\n    disableButtons([USER_AVAILABLE]);\n    enableButtons([INCOMING_CALL, USER_UNAVAILABLE]);\n  } else {\n    disableButtons([INCOMING_CALL, USER_UNAVAILABLE]);\n    enableButtons([USER_AVAILABLE]);\n  }\n}\n\nfunction logOut() {\n  cti.userLoggedOut();\n  disableButtons([\n    LOG_OUT,\n    OUTGOING_CALL,\n    INCOMING_CALL,\n    ANSWER_CALL,\n    END_CALL,\n    COMPLETE_CALL,\n    USER_AVAILABLE,\n    USER_UNAVAILABLE,\n  ]);\n  enableButtons([LOG_IN]);\n}\n\nfunction userAvailable() {\n  cti.userAvailable();\n  state.userAvailable = true;\n  disableButtons([USER_AVAILABLE]);\n  enableButtons([INCOMING_CALL, USER_UNAVAILABLE]);\n}\n\nfunction userUnavailable() {\n  cti.userUnavailable();\n  state.userAvailable = false;\n  disableButtons([INCOMING_CALL, USER_UNAVAILABLE]);\n  enableButtons([USER_AVAILABLE]);\n}\n\nfunction incomingCall(optionalPayload) {\n  state.externalCallId = (0,uuid__WEBPACK_IMPORTED_MODULE_1__[\"default\"])();\n  const payload = {\n    createEngagement: true,\n    fromNumber: state.fromNumber,\n    toNumber: state.toNumber,\n    externalCallId: state.externalCallId,\n  };\n\n  // Trigger incoming call from window\n  // Send message to all open remote tabs\n  if (!state.usesCallingWindow && state.iframeLocation === \"window\") {\n    console.log(\n      \"Sent broadcast message to remote:\",\n      toSnakeUpperCase(INCOMING_CALL),\n      payload,\n    );\n    bc.postMessage({ type: INCOMING_CALL, payload });\n    return;\n  }\n\n  // Send message to HubSpot\n  window.setTimeout(() => {\n    cti.incomingCall(optionalPayload || payload);\n  }, 500);\n  disableButtons([OUTGOING_CALL, INCOMING_CALL, USER_UNAVAILABLE]);\n  enableButtons([ANSWER_CALL, END_CALL]);\n}\n\nfunction outgoingCall() {\n  state.externalCallId = (0,uuid__WEBPACK_IMPORTED_MODULE_1__[\"default\"])();\n  window.setTimeout(() => {\n    cti.outgoingCall({\n      createEngagement: true,\n      toNumber: state.toNumber,\n      fromNumber: state.fromNumber,\n      externalCallId: state.externalCallId,\n    });\n  }, 500);\n  disableButtons([OUTGOING_CALL, INCOMING_CALL, USER_UNAVAILABLE]);\n  enableButtons([ANSWER_CALL, END_CALL]);\n}\n\nfunction answerCall() {\n  cti.callAnswered({ externalCallId: state.externalCallId });\n  disableButtons([ANSWER_CALL]);\n}\n\nfunction endCall() {\n  cti.callEnded({\n    callEndStatus: callEndStatus.INTERNAL_COMPLETED,\n    externalCallId: state.externalCallId,\n  });\n  disableButtons([ANSWER_CALL, END_CALL]);\n  enableButtons([COMPLETE_CALL]);\n}\n\nfunction completeCall() {\n  cti.callCompleted({\n    engagementId: state.engagementId,\n    externalCallId: state.externalCallId,\n    hideWidget: false,\n    engagementProperties: {\n      hs_call_title: \"Demo call\",\n      hs_call_body: \"Resolved issue\",\n    },\n  });\n  state.externalCallId = \"\";\n  disableButtons([COMPLETE_CALL]);\n  enableButtons([OUTGOING_CALL, INCOMING_CALL, USER_UNAVAILABLE]);\n}\n\nfunction sendError() {\n  cti.sendError({\n    type: messageType.ERROR,\n    message: \"This is an error alert shown in the Hubspot UI\",\n  });\n}\n\nfunction resizeWidget() {\n  sizeInfo.width += 20;\n  sizeInfo.height += 20;\n  cti.resizeWidget({\n    width: sizeInfo.width,\n    height: sizeInfo.height,\n  });\n}\n\nfunction publishToChannel(data) {\n  state.engagementId = data && data.engagementId;\n  cti.publishToChannel(data);\n}\n\n\n//# sourceURL=webpack://calling-extensions-sdk-demo-minimal-js/./index.js?");

/***/ }),

/***/ "./node_modules/@hubspot/calling-extensions-sdk/dist/main.esm.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@hubspot/calling-extensions-sdk/dist/main.esm.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Constants: () => (/* binding */ y),\n/* harmony export */   IFrameManager: () => (/* binding */ b),\n/* harmony export */   \"default\": () => (/* binding */ P)\n/* harmony export */ });\nvar e={d:(t,s)=>{for(var E in s)e.o(s,E)&&!e.o(t,E)&&Object.defineProperty(t,E,{enumerable:!0,get:s[E]})},o:(e,t)=>Object.prototype.hasOwnProperty.call(e,t),r:e=>{\"undefined\"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:\"Module\"}),Object.defineProperty(e,\"__esModule\",{value:!0})}},t={};e.d(t,{YM:()=>s,qO:()=>p,Ay:()=>H});var s={};e.r(s),e.d(s,{COMPANY:()=>G,CONTACT:()=>O,VERSION:()=>E,callEndStatus:()=>M,callEndingStatus:()=>c,callInProgressStatus:()=>R,callRingingStatus:()=>h,callStatus:()=>S,callerIdTypes:()=>U,debugMessageType:()=>a,errorType:()=>A,messageHandlerNames:()=>o,messageType:()=>i,thirdPartyToHostEvents:()=>n});const E=\"0.9.0\",a={FROM_HUBSPOT:\"From HubSpot\",TO_HUBSPOT:\"To HubSpot\",GENERIC_MESSAGE:\"Generic Message\"},n={CALL_ANSWERED:\"CALL_ANSWERED\",CALL_COMPLETED:\"CALL_COMPLETED\",CALL_DATA:\"CALL_DATA\",CALL_ENDED:\"CALL_ENDED\",INCOMING_CALL:\"INCOMING_CALL\",INITIALIZED:\"INITIALIZED\",LOGGED_IN:\"LOGGED_IN\",LOGGED_OUT:\"LOGGED_OUT\",NAVIGATE_TO_RECORD:\"NAVIGATE_TO_RECORD\",OUTGOING_CALL_STARTED:\"OUTGOING_CALL_STARTED\",PUBLISH_TO_CHANNEL:\"PUBLISH_TO_CHANNEL\",RESIZE_WIDGET:\"RESIZE_WIDGET\",USER_AVAILABLE:\"USER_AVAILABLE\",USER_UNAVAILABLE:\"USER_UNAVAILABLE\"},i={...n,CALLER_ID_MATCH_FAILED:\"CALLER_ID_MATCH_FAILED\",CALLER_ID_MATCH_SUCCEEDED:\"CALLER_ID_MATCH_SUCCEEDED\",CREATE_ENGAGEMENT_FAILED:\"CREATE_ENGAGEMENT_FAILED\",CREATE_ENGAGEMENT_SUCCEEDED:\"CREATE_ENGAGEMENT_SUCCEEDED\",DIAL_NUMBER:\"DIAL_NUMBER\",ENGAGEMENT_CREATED:\"ENGAGEMENT_CREATED\",INITIATE_CALL_ID_FAILED:\"INITIATE_CALL_ID_FAILED\",INITIATE_CALL_ID_SUCCEEDED:\"INITIATE_CALL_ID_SUCCEEDED\",NAVIGATE_TO_RECORD_FAILED:\"NAVIGATE_TO_RECORD_FAILED\",UPDATE_ASSOCIATIONS_FAILED:\"UPDATE_ASSOCIATIONS_FAILED\",PUBLISH_TO_CHANNEL_FAILED:\"PUBLISH_TO_CHANNEL_FAILED\",PUBLISH_TO_CHANNEL_SUCCEEDED:\"PUBLISH_TO_CHANNEL_SUCCEEDED\",SET_WIDGET_URL_FAILED:\"SET_WIDGET_URL_FAILED\",UPDATE_ENGAGEMENT_FAILED:\"UPDATE_ENGAGEMENT_FAILED\",UPDATE_ENGAGEMENT_SUCCEEDED:\"UPDATE_ENGAGEMENT_SUCCEEDED\",VISIBILITY_CHANGED:\"VISIBILITY_CHANGED\",END_CALL:\"END_CALL\",ERROR:\"ERROR\",READY:\"READY\",SET_CALL_STATE:\"SET_CALL_STATE\",SET_WIDGET_URL:\"SET_WIDGET_URL\",SYNC_ACK_FAILED:\"SYNC_ACK_FAILED\",SYNC_ACK:\"SYNC_ACK\",SYNC:\"SYNC\",UNLOADING:\"UNLOADING\",FAILED:\"FAILED\"},o={[i.CALLER_ID_MATCH_FAILED]:\"onCallerIdMatchFailed\",[i.CALLER_ID_MATCH_SUCCEEDED]:\"onCallerIdMatchSucceeded\",[i.CREATE_ENGAGEMENT_FAILED]:\"onCreateEngagementFailed\",[i.CREATE_ENGAGEMENT_SUCCEEDED]:\"onCreateEngagementSucceeded\",[i.DIAL_NUMBER]:\"onDialNumber\",[i.END_CALL]:\"onEndCall\",[i.ENGAGEMENT_CREATED]:\"onEngagementCreated\",[i.INITIATE_CALL_ID_FAILED]:\"onInitiateCallIdFailed\",[i.INITIATE_CALL_ID_SUCCEEDED]:\"onInitiateCallIdSucceeded\",[i.NAVIGATE_TO_RECORD_FAILED]:\"onNavigateToRecordFailed\",[i.UPDATE_ASSOCIATIONS_FAILED]:\"onUpdateAssociationsFailed\",[i.PUBLISH_TO_CHANNEL_FAILED]:\"onPublishToChannelFailed\",[i.PUBLISH_TO_CHANNEL_SUCCEEDED]:\"onPublishToChannelSucceeded\",[i.READY]:\"onReady\",[i.SET_CALL_STATE]:\"onSetCallState\",[i.SET_WIDGET_URL_FAILED]:\"onSetWidgetUrlFailed\",[i.UPDATE_ENGAGEMENT_FAILED]:\"onUpdateEngagementFailed\",[i.UPDATE_ENGAGEMENT_SUCCEEDED]:\"onUpdateEngagementSucceeded\",[i.VISIBILITY_CHANGED]:\"onVisibilityChanged\",[i.FAILED]:\"onFailed\"},A={UNKNOWN_MESSAGE_TYPE:\"UNKNOWN_MESSAGE_TYPE\"},_=\"CONNECTING\",r=\"CALLING_CRM_USER\",d=\"IN_PROGRESS\",I=\"CANCELED\",N=\"FAILED\",L=\"BUSY\",l=\"NO_ANSWER\",T=\"COMPLETED\",C=\"ENDING\",D=\"QUEUED\",g=\"RINGING\",S={INTERNAL_CONNECTING:_,INTERNAL_CALLING_CRM_USER:r,INTERNAL_IN_PROGRESS:d,INTERNAL_CANCELED:I,INTERNAL_FAILED:N,INTERNAL_BUSY:L,INTERNAL_NO_ANSWER:l,INTERNAL_COMPLETED:T,INTERNAL_ENDING:C,INTERNAL_QUEUED:D,INTERNAL_RINGING:g},h={INTERNAL_QUEUED:D,INTERNAL_RINGING:g,INTERNAL_CONNECTING:_,INTERNAL_CALLING_CRM_USER:r},R={INTERNAL_IN_PROGRESS:d},c={INTERNAL_ENDING:C},M={INTERNAL_COMPLETED:T,INTERNAL_FAILED:N,INTERNAL_CANCELED:I,INTERNAL_BUSY:L,INTERNAL_NO_ANSWER:l},O=\"CONTACT\",G=\"COMPANY\",U={CONTACT:O,COMPANY:G},m=`[calling-extensions-sdk@${E}]`;class u{constructor(e){this.firstSyncSent=0,this.options=e;const{iFrameOptions:t,onMessageHandler:s,debugMode:E}=e;if(this.onMessageHandler=s,!this.onMessageHandler)throw new Error(\"Invalid options: onMessageHandler is not defined\");this.isIFrameHost=!!t,this.debugMode=E,this.callbacks={},this.instanceId=Date.now(),this.instanceRegexp=new RegExp(`^${this.instanceId}`),this.isReady=!1,this.messageHandler=e=>this.onMessage(e),window.addEventListener(\"message\",this.messageHandler),this.iFrame=t?u.createIFrame(t,(()=>{this.firstSyncSent=Date.now(),this.isReady=!1,this.sendSync()}),this.handleLoadError):null,this.destinationWindow=t&&this.iFrame?this.iFrame.contentWindow:window.parent,this.destinationHost=u.getDestinationHost(t)}static createMessageId(e){return`${e}_${Date.now()}`}static getHostElement(e){const t=document.querySelector(e);if(!t)throw new Error(`hostElement not found. Selector - ${e}`);return t}static extractHostFromUrl(e){const t=document.createElement(\"a\");return t.href=e,`${t.protocol}//${t.host}`}static getDestinationHost(e){const t=e?e.src:document.referrer;return u.extractHostFromUrl(t)}handleLoadError(){this.onMessageHandler({type:i.SYNC_ACK_FAILED})}static createIFrame(e,t,s){const{src:E,width:a,height:n,hostElementSelector:i}=e;if(!(E&&a&&n&&i))throw new Error(\"iFrameOptions is missing one of the required properties - {src, width, height, hostElementSelector}.\");const o=document.createElement(\"iframe\");o.onload=t,o.onerror=s,o.src=E,o.width=a,o.height=n,o.allow=\"microphone; autoplay\",o.id=\"hubspot-calling-extension-iframe\";const A=u.getHostElement(i);return A.innerHTML=\"\",A.appendChild(o),A.querySelector(\"iframe\")}updateIFrameSize(e){const{width:t,height:s}=e;this.iFrame&&(t&&this.iFrame.setAttribute(\"width\",u.formatSize(t)),s&&this.iFrame.setAttribute(\"height\",u.formatSize(s)))}static formatSize(e){return\"number\"==typeof e?`${e}px`:e}onReady(e={}){this.isReady=!0,this.onMessageHandler({type:i.READY,data:e})}remove(){window.removeEventListener(\"message\",this.messageHandler),this.iFrame&&this.options&&this.options.iFrameOptions&&(u.getHostElement(this.options.iFrameOptions.hostElementSelector).innerHTML=\"\",this.isReady=!1,this.iFrame=null,this.options=null)}sendMessage(e,t){const{type:s}=e;if(s!==i.SYNC&&!this.isReady)return void console.warn(m,\"iFrame not initialized to send a message within HubSpot\",e);let{messageId:E}=e;E||(E=u.createMessageId(this.instanceId),t&&(this.callbacks[E]=t));const n=Object.assign({},e,{messageId:E});this.logDebugMessage(m,a.TO_HUBSPOT,s,e),this.destinationWindow&&this.destinationWindow.postMessage(n,this.destinationHost)}onMessage(e){const{data:t,origin:s}=e,{type:n}=e.data;if(n===i.SYNC){const{portalId:s,userId:o,ownerId:A,engagementId:_,iframeLocation:r,usesCallingWindow:d}=e.data;if(!this.isReady){this.isReady=!0;const I=Object.assign({},e.data,{type:i.SYNC_ACK,debugMode:this.debugMode,version:E,iFrameUrl:u.extractHostFromUrl(window.location.href)}),{hostUrl:N}=e.data;this.destinationHost=N||this.destinationHost,this.logDebugMessage(m,a.FROM_HUBSPOT,n,t),this.sendMessage(I),this.onReady({engagementId:_,portalId:s,userId:o,ownerId:A,iframeLocation:r,usesCallingWindow:d})}return}if(this.destinationHost!==s)return;const{messageId:o}=t;if(o&&n){if(this.logDebugMessage(m,a.FROM_HUBSPOT,n,t),n===i.SET_WIDGET_URL){const{iFrameUrl:e}=t;return this.destinationHost=e||this.destinationHost,void this.onReady({iFrameUrl:e})}if(this.instanceRegexp.test(o)){const e=this.callbacks[o];e&&(e(t),delete this.callbacks[o])}else this.onMessageHandler(t)}}sendSync(){Date.now()-this.firstSyncSent>3e4?this.onMessageHandler({type:i.SYNC_ACK_FAILED}):(this.sendMessage({type:i.SYNC,hostUrl:u.extractHostFromUrl(window.location.href)},(e=>{const{iFrameUrl:t}=e;this.destinationHost=t||this.destinationHost,this.onReady(),this.debugMode=e&&e.debugMode})),window.setTimeout((()=>{this.iFrame&&!this.isReady&&this.sendSync()}),100))}logDebugMessage(...e){this.debugMode?console.log.call(null,e):console.debug.call(null,e)}}const p=u,F=`[calling-extensions-sdk@${E}]`,H=class{constructor(e){if(!e||!e.eventHandlers)throw new Error(\"Invalid options or missing eventHandlers.\");this.options=e,this.iFrameManager=new p({iFrameOptions:e.iFrameOptions,debugMode:e.debugMode,onMessageHandler:e=>this.onMessageHandler(e)})}initialized(e){this.sendMessage({type:i.INITIALIZED,data:e})}userAvailable(){this.sendMessage({type:i.USER_AVAILABLE})}userUnavailable(){this.sendMessage({type:i.USER_UNAVAILABLE})}userLoggedIn(){this.sendMessage({type:i.LOGGED_IN})}userLoggedOut(){this.sendMessage({type:i.LOGGED_OUT})}incomingCall(e){this.sendMessage({type:i.INCOMING_CALL,data:e})}outgoingCall(e){this.sendMessage({type:i.OUTGOING_CALL_STARTED,data:e})}callAnswered(e){this.sendMessage({type:i.CALL_ANSWERED,data:e})}navigateToRecord(e){this.sendMessage({type:i.NAVIGATE_TO_RECORD,data:e})}callData(e){this.sendMessage({type:i.CALL_DATA,data:e})}callEnded(e){this.sendMessage({type:i.CALL_ENDED,data:e})}callCompleted(e){this.sendMessage({type:i.CALL_COMPLETED,data:e})}sendError(e){this.sendMessage({type:i.ERROR,data:e})}resizeWidget(e){this.sendMessage({type:i.RESIZE_WIDGET,data:e})}sendMessage(e){this.iFrameManager.sendMessage(e)}logDebugMessage({message:e,type:t=a.GENERIC_MESSAGE}){this.iFrameManager.logDebugMessage(F,t,e)}onMessageHandler(e){const{type:t,data:s}=e,{eventHandlers:E}=this.options;let a;if(t in o){const e=o[t];e in E&&(a=E[e])}else this.sendMessage({type:i.ERROR,data:{type:A.UNKNOWN_MESSAGE_TYPE,data:{originalMessage:e}}});if(String(t).endsWith(\"_FAILED\")){const t=E[i.FAILED];t&&t(s,e)}a=a||E.defaultEventHandler,a?a(s,e):console.error(`No event handler is available to handle message of type: ${t}`)}publishToChannel(e){this.sendMessage({type:i.PUBLISH_TO_CHANNEL,data:e})}setWidgetUrl(e){this.sendMessage({type:i.SET_WIDGET_URL,data:e})}};var y=t.YM,b=t.qO,P=t.Ay;\n\n//# sourceURL=webpack://calling-extensions-sdk-demo-minimal-js/./node_modules/@hubspot/calling-extensions-sdk/dist/main.esm.js?");

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/native.js":
/*!******************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/native.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nvar randomUUID = typeof crypto !== 'undefined' && crypto.randomUUID && crypto.randomUUID.bind(crypto);\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n  randomUUID\n});\n\n//# sourceURL=webpack://calling-extensions-sdk-demo-minimal-js/./node_modules/uuid/dist/esm-browser/native.js?");

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/regex.js":
/*!*****************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/regex.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/i);\n\n//# sourceURL=webpack://calling-extensions-sdk-demo-minimal-js/./node_modules/uuid/dist/esm-browser/regex.js?");

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/rng.js":
/*!***************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/rng.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ rng)\n/* harmony export */ });\n// Unique ID creation requires a high quality random # generator. In the browser we therefore\n// require the crypto API and do not support built-in fallback to lower quality random number\n// generators (like Math.random()).\n\nvar getRandomValues;\nvar rnds8 = new Uint8Array(16);\nfunction rng() {\n  // lazy load so that environments that need to polyfill have a chance to do so\n  if (!getRandomValues) {\n    // getRandomValues needs to be invoked in a context where \"this\" is a Crypto implementation.\n    getRandomValues = typeof crypto !== 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto);\n    if (!getRandomValues) {\n      throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');\n    }\n  }\n  return getRandomValues(rnds8);\n}\n\n//# sourceURL=webpack://calling-extensions-sdk-demo-minimal-js/./node_modules/uuid/dist/esm-browser/rng.js?");

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/stringify.js":
/*!*********************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/stringify.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__),\n/* harmony export */   unsafeStringify: () => (/* binding */ unsafeStringify)\n/* harmony export */ });\n/* harmony import */ var _validate_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./validate.js */ \"./node_modules/uuid/dist/esm-browser/validate.js\");\n\n\n/**\n * Convert array of 16 byte values to UUID string format of the form:\n * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX\n */\nvar byteToHex = [];\nfor (var i = 0; i < 256; ++i) {\n  byteToHex.push((i + 0x100).toString(16).slice(1));\n}\nfunction unsafeStringify(arr, offset = 0) {\n  // Note: Be careful editing this code!  It's been tuned for performance\n  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434\n  //\n  // Note to future-self: No, you can't remove the `toLowerCase()` call.\n  // REF: https://github.com/uuidjs/uuid/pull/677#issuecomment-1757351351\n  return (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();\n}\nfunction stringify(arr, offset = 0) {\n  var uuid = unsafeStringify(arr, offset);\n  // Consistency check for valid UUID.  If this throws, it's likely due to one\n  // of the following:\n  // - One or more input array values don't map to a hex octet (leading to\n  // \"undefined\" in the uuid)\n  // - Invalid input values for the RFC `version` or `variant` fields\n  if (!(0,_validate_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(uuid)) {\n    throw TypeError('Stringified UUID is invalid');\n  }\n  return uuid;\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (stringify);\n\n//# sourceURL=webpack://calling-extensions-sdk-demo-minimal-js/./node_modules/uuid/dist/esm-browser/stringify.js?");

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/v4.js":
/*!**************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/v4.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _native_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./native.js */ \"./node_modules/uuid/dist/esm-browser/native.js\");\n/* harmony import */ var _rng_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./rng.js */ \"./node_modules/uuid/dist/esm-browser/rng.js\");\n/* harmony import */ var _stringify_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./stringify.js */ \"./node_modules/uuid/dist/esm-browser/stringify.js\");\n\n\n\nfunction v4(options, buf, offset) {\n  if (_native_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].randomUUID && !buf && !options) {\n    return _native_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].randomUUID();\n  }\n  options = options || {};\n  var rnds = options.random || (options.rng || _rng_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"])();\n\n  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`\n  rnds[6] = rnds[6] & 0x0f | 0x40;\n  rnds[8] = rnds[8] & 0x3f | 0x80;\n\n  // Copy bytes to buffer, if provided\n  if (buf) {\n    offset = offset || 0;\n    for (var i = 0; i < 16; ++i) {\n      buf[offset + i] = rnds[i];\n    }\n    return buf;\n  }\n  return (0,_stringify_js__WEBPACK_IMPORTED_MODULE_2__.unsafeStringify)(rnds);\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (v4);\n\n//# sourceURL=webpack://calling-extensions-sdk-demo-minimal-js/./node_modules/uuid/dist/esm-browser/v4.js?");

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/validate.js":
/*!********************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/validate.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _regex_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./regex.js */ \"./node_modules/uuid/dist/esm-browser/regex.js\");\n\nfunction validate(uuid) {\n  return typeof uuid === 'string' && _regex_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].test(uuid);\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (validate);\n\n//# sourceURL=webpack://calling-extensions-sdk-demo-minimal-js/./node_modules/uuid/dist/esm-browser/validate.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./index.js");
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});