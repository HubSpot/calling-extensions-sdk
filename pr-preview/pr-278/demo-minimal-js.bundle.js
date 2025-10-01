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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   answerCall: () => (/* binding */ answerCall),\n/* harmony export */   completeCall: () => (/* binding */ completeCall),\n/* harmony export */   endCall: () => (/* binding */ endCall),\n/* harmony export */   incomingCall: () => (/* binding */ incomingCall),\n/* harmony export */   initialize: () => (/* binding */ initialize),\n/* harmony export */   logIn: () => (/* binding */ logIn),\n/* harmony export */   logOut: () => (/* binding */ logOut),\n/* harmony export */   outgoingCall: () => (/* binding */ outgoingCall),\n/* harmony export */   publishToChannel: () => (/* binding */ publishToChannel),\n/* harmony export */   resizeWidget: () => (/* binding */ resizeWidget),\n/* harmony export */   sendError: () => (/* binding */ sendError),\n/* harmony export */   setWidgetUrl: () => (/* binding */ setWidgetUrl),\n/* harmony export */   state: () => (/* binding */ state),\n/* harmony export */   transferCall: () => (/* binding */ transferCall),\n/* harmony export */   userAvailable: () => (/* binding */ userAvailable),\n/* harmony export */   userUnavailable: () => (/* binding */ userUnavailable)\n/* harmony export */ });\n/* harmony import */ var uuid__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! uuid */ \"./node_modules/uuid/dist/esm-browser/v4.js\");\n/* eslint-disable no-use-before-define */\n/* eslint-disable no-undef */\n\nconst CallingExtensions = window.default;\nconst { Constants } = window;\nconst { messageType, callEndStatus } = Constants;\n\nfunction getQueryParam(param) {\n  const urlParams = new URLSearchParams(window.location.search);\n  return urlParams.get(param);\n}\n\nconst broadcastChannelName = \"calling-extensions-demo\";\nconst bc = new BroadcastChannel(broadcastChannelName);\n\nconst state = {\n  externalCallId: \"\",\n  engagementId: 0,\n  fromNumber: \"+18884827768\",\n  incomingContactName: \"\",\n  toNumber: \"+442073238299\",\n  userAvailable: false,\n  userId: 0,\n  enforceButtonsOrder: false,\n  ownerId: 0,\n  usesCallingWindow: getQueryParam(\"usesCallingWindow\") !== \"false\",\n  iframeLocation: getQueryParam(\"iframeLocation\") || \"widget\",\n  broadcastChannelName,\n};\n\nconst sizeInfo = {\n  width: 400,\n  height: 650,\n};\n\n/** Button IDs */\nconst ANSWER_CALL = \"answercall\";\nconst COMPLETE_CALL = \"completecall\";\nconst END_CALL = \"endcall\";\nconst INCOMING_CALL = \"incomingcall\";\nconst INITIALIZE = \"initialize\";\nconst LOG_IN = \"login\";\nconst LOG_OUT = \"logout\";\nconst OUTGOING_CALL = \"outgoingcall\";\nconst RESIZE_WIDGET = \"resizewidget\";\nconst SEND_ERROR = \"senderror\";\nconst USER_AVAILABLE = \"useravailable\";\nconst USER_UNAVAILABLE = \"userunavailable\";\nconst TRANSFER_CALL = \"transfercall\";\n\nconst eventHandlers = {\n  [INCOMING_CALL]: incomingCall,\n  [ANSWER_CALL]: answerCall,\n  [END_CALL]: endCall,\n  [COMPLETE_CALL]: completeCall,\n  [TRANSFER_CALL]: transferCall,\n};\n\nfunction disableButtons(ids) {\n  if (!state.enforceButtonsOrder) {\n    return;\n  }\n  ids.forEach(id => {\n    document.querySelector(`#${id}`).setAttribute(\"disabled\", true);\n  });\n}\n\nfunction enableButtons(ids) {\n  if (!state.enforceButtonsOrder) {\n    return;\n  }\n  ids.forEach(id => {\n    document.querySelector(`#${id}`).removeAttribute(\"disabled\");\n  });\n}\n\nconst getUsesCallingWindowFalseInPopup = () => {\n  return !state.usesCallingWindow && state.iframeLocation === \"window\";\n};\n\nconst getUsesCallingWindowFalseInRemote = () => {\n  return !state.usesCallingWindow && state.iframeLocation === \"remote\";\n};\n\nconst sendBroadcastMessage = (type, payload = {}) => {\n  console.log(\"Sent broadcast message to remote:\", type, payload);\n  bc.postMessage({ type, payload });\n};\n\nfunction listenToBroadcastMessage() {\n  bc.onmessage = ({ data }) => {\n    console.log(\n      \"Received broadcast message from window:\",\n      data.type,\n      data.payload,\n    );\n\n    if (eventHandlers[data.type]) {\n      eventHandlers[data.type](data.payload);\n    }\n  };\n}\n\nconst cti = new CallingExtensions({\n  debugMode: true,\n  eventHandlers: {\n    // eslint-disable-next-line object-curly-newline\n    onReady: ({\n      portalId,\n      userId,\n      ownerId,\n      usesCallingWindow,\n      iframeLocation,\n      hostUrl,\n    } = {}) => {\n      cti.initialized({\n        isLoggedIn: false,\n        isAvailable: false,\n        sizeInfo,\n      });\n      disableButtons([\n        INITIALIZE,\n        USER_AVAILABLE,\n        USER_UNAVAILABLE,\n        OUTGOING_CALL,\n        INCOMING_CALL,\n        ANSWER_CALL,\n        END_CALL,\n        COMPLETE_CALL,\n        TRANSFER_CALL,\n        LOG_OUT,\n      ]);\n      enableButtons([LOG_IN, SEND_ERROR, RESIZE_WIDGET]);\n      if (portalId) {\n        state.portalId = portalId;\n      }\n      if (userId) {\n        state.userId = userId;\n      }\n      if (ownerId) {\n        state.ownerId = ownerId;\n      }\n\n      if (iframeLocation) {\n        state.iframeLocation = iframeLocation;\n      }\n\n      if (hostUrl && usesCallingWindow === false) {\n        state.usesCallingWindow = false;\n\n        const url = `${hostUrl}/calling-integration-popup-ui/${portalId}?usesCallingWindow=false`;\n\n        document\n          .querySelector(\".openwindow\")\n          .children[0].setAttribute(\"href\", url);\n\n        document.querySelector(\".openwindow\").setAttribute(\"display\", \"block\");\n      }\n\n      if (getUsesCallingWindowFalseInRemote()) {\n        listenToBroadcastMessage();\n      }\n    },\n    onDialNumber: (data, rawEvent) => {\n      const { phoneNumber } = data;\n      state.toNumber = phoneNumber;\n    },\n    onEngagementCreated: (data, rawEvent) => {\n      const { engagementId } = data;\n      state.engagementId = engagementId;\n    },\n    onEndCall: () => {\n      window.setTimeout(() => {\n        cti.callEnded();\n      }, 500);\n    },\n    onVisibilityChanged: (data, rawEvent) => {\n      /** The cti's visibility has changed. */\n    },\n    onCreateEngagementSucceeded: (data, rawEvent) => {\n      const { engagementId } = data;\n      state.engagementId = engagementId;\n    },\n    onCreateEngagementFailed: (data, rawEvent) => {\n      /** HubSpot was unable to create an engagement for this call. */\n    },\n    onUpdateEngagementSucceeded: (data, rawEvent) => {\n      const { engagementId } = data;\n      state.engagementId = engagementId;\n    },\n    onUpdateEngagementFailed: (data, rawEvent) => {\n      /** HubSpot was unable to update the engagement for this call. */\n    },\n    onCallerIdMatchSucceeded: (data, rawEvent) => {\n      const { callerIdMatches } = data;\n      if (callerIdMatches.length) {\n        const firstCallerIdMatch = callerIdMatches[0];\n        if (firstCallerIdMatch.callerIdType === \"CONTACT\") {\n          state.incomingContactName = `${firstCallerIdMatch.firstName} ${firstCallerIdMatch.lastName}`;\n        } else if (firstCallerIdMatch.callerIdType === \"COMPANY\") {\n          state.incomingContactName = firstCallerIdMatch.name;\n        }\n        cti.logDebugMessage({\n          message: `Incoming call from ${state.incomingContactName} ${state.fromNumber}`,\n          type: `${callerIdMatches.length} Caller ID Matches`,\n        });\n        cti.navigateToRecord({\n          objectCoordinates: firstCallerIdMatch.objectCoordinates,\n        });\n        return;\n      }\n      cti.logDebugMessage({\n        message: `Incoming call from ${state.fromNumber}`,\n        type: \"No Caller ID Matches\",\n      });\n    },\n    onCallerIdMatchFailed: (data, rawEvent) => {\n      cti.logDebugMessage({\n        message: `Incoming call from ${state.fromNumber}`,\n        type: \"Caller ID Match Failed\",\n      });\n    },\n    onNavigateToRecordFailed: (data, rawEvent) => {\n      /** HubSpot was unable to navigate to the desired record page. */\n    },\n    onPublishToChannelFailed: (data, rawEvent) => {\n      /** HubSpot was unable to publish the call to the connected channel. */\n    },\n    onPublishToChannelSucceeded: (data, rawEvent) => {\n      /** HubSpot successfully published the call to the connected channel. */\n    },\n    onSetWidgetUrlFailed: (data, rawEvent) => {\n      /** HubSpot was unable to change the widget iframe src URL. */\n    },\n  },\n});\n\nfunction setWidgetUrl() {\n  // Redirect to a new URL\n  const newUrl =\n    \"https://github.hubspot.com/calling-extensions-sdk/demo-minimal-js.html\";\n  cti.setWidgetUrl({ iFrameUrl: newUrl });\n}\n\nfunction initialize() {\n  cti.initialized({\n    isLoggedIn: false,\n  });\n  disableButtons([\n    INITIALIZE,\n    USER_AVAILABLE,\n    USER_UNAVAILABLE,\n    OUTGOING_CALL,\n    INCOMING_CALL,\n    ANSWER_CALL,\n    END_CALL,\n    COMPLETE_CALL,\n    TRANSFER_CALL,\n    LOG_OUT,\n  ]);\n  enableButtons([LOG_IN, SEND_ERROR, RESIZE_WIDGET]);\n}\n\nfunction logIn() {\n  cti.userLoggedIn();\n  disableButtons([LOG_IN, INITIALIZE]);\n  enableButtons([LOG_OUT, OUTGOING_CALL]);\n  if (state.userAvailable) {\n    disableButtons([USER_AVAILABLE]);\n    enableButtons([INCOMING_CALL, USER_UNAVAILABLE]);\n  } else {\n    disableButtons([INCOMING_CALL, USER_UNAVAILABLE]);\n    enableButtons([USER_AVAILABLE]);\n  }\n}\n\nfunction logOut() {\n  cti.userLoggedOut();\n  disableButtons([\n    LOG_OUT,\n    OUTGOING_CALL,\n    INCOMING_CALL,\n    ANSWER_CALL,\n    END_CALL,\n    COMPLETE_CALL,\n    TRANSFER_CALL,\n    USER_AVAILABLE,\n    USER_UNAVAILABLE,\n  ]);\n  enableButtons([LOG_IN]);\n}\n\nfunction userAvailable() {\n  cti.userAvailable();\n  state.userAvailable = true;\n  disableButtons([USER_AVAILABLE]);\n  enableButtons([INCOMING_CALL, USER_UNAVAILABLE]);\n}\n\nfunction userUnavailable() {\n  cti.userUnavailable();\n  state.userAvailable = false;\n  disableButtons([INCOMING_CALL, USER_UNAVAILABLE]);\n  enableButtons([USER_AVAILABLE]);\n}\n\nfunction incomingCall(optionalPayload) {\n  state.externalCallId = (0,uuid__WEBPACK_IMPORTED_MODULE_0__[\"default\"])();\n  const payload = {\n    createEngagement: true,\n    fromNumber: state.fromNumber,\n    toNumber: state.toNumber,\n    externalCallId: state.externalCallId,\n  };\n\n  if (getUsesCallingWindowFalseInPopup()) {\n    sendBroadcastMessage(INCOMING_CALL, payload);\n    return;\n  }\n\n  // Send message to HubSpot\n  window.setTimeout(() => {\n    cti.incomingCall(optionalPayload || payload);\n  }, 500);\n  disableButtons([OUTGOING_CALL, INCOMING_CALL, USER_UNAVAILABLE]);\n  enableButtons([ANSWER_CALL, END_CALL, TRANSFER_CALL]);\n}\n\nfunction outgoingCall() {\n  state.externalCallId = (0,uuid__WEBPACK_IMPORTED_MODULE_0__[\"default\"])();\n  window.setTimeout(() => {\n    cti.outgoingCall({\n      createEngagement: true,\n      toNumber: state.toNumber,\n      fromNumber: state.fromNumber,\n      externalCallId: state.externalCallId,\n    });\n  }, 500);\n  disableButtons([OUTGOING_CALL, INCOMING_CALL, USER_UNAVAILABLE]);\n  enableButtons([ANSWER_CALL, END_CALL]);\n}\n\nfunction answerCall() {\n  if (getUsesCallingWindowFalseInPopup()) {\n    sendBroadcastMessage(ANSWER_CALL);\n    return;\n  }\n\n  cti.callAnswered({ externalCallId: state.externalCallId });\n  disableButtons([ANSWER_CALL]);\n}\n\nfunction endCall() {\n  if (getUsesCallingWindowFalseInPopup()) {\n    sendBroadcastMessage(END_CALL);\n    return;\n  }\n\n  cti.callEnded({\n    callEndStatus: callEndStatus.INTERNAL_COMPLETED,\n    externalCallId: state.externalCallId,\n  });\n  disableButtons([ANSWER_CALL, END_CALL]);\n  enableButtons([COMPLETE_CALL]);\n}\n\nfunction transferCall() {\n  if (getUsesCallingWindowFalseInPopup()) {\n    sendBroadcastMessage(TRANSFER_CALL);\n    return;\n  }\n\n  cti.callTransferred({ externalCallId: state.externalCallId });\n  state.externalCallId = \"\";\n  disableButtons([ANSWER_CALL, END_CALL, TRANSFER_CALL]);\n  enableButtons([OUTGOING_CALL, INCOMING_CALL, USER_UNAVAILABLE]);\n}\n\nfunction completeCall() {\n  if (getUsesCallingWindowFalseInPopup()) {\n    sendBroadcastMessage(COMPLETE_CALL);\n    return;\n  }\n\n  cti.callCompleted({\n    engagementId: state.engagementId,\n    externalCallId: state.externalCallId,\n    hideWidget: false,\n    engagementProperties: {\n      hs_call_title: \"Demo call\",\n      hs_call_body: \"Resolved issue\",\n    },\n  });\n  state.externalCallId = \"\";\n  disableButtons([COMPLETE_CALL]);\n  enableButtons([OUTGOING_CALL, INCOMING_CALL, USER_UNAVAILABLE]);\n}\n\nfunction sendError() {\n  cti.sendError({\n    type: messageType.ERROR,\n    message: \"This is an error alert shown in the Hubspot UI\",\n  });\n}\n\nfunction resizeWidget() {\n  sizeInfo.width += 20;\n  sizeInfo.height += 20;\n  cti.resizeWidget({\n    width: sizeInfo.width,\n    height: sizeInfo.height,\n  });\n}\n\nfunction publishToChannel(data) {\n  state.engagementId = data && data.engagementId;\n  cti.publishToChannel(data);\n}\n\n\n//# sourceURL=webpack://calling-extensions-sdk-demo-minimal-js/./index.js?");

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