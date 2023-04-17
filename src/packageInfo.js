"use es6";

const { version } = require("../package.json");

export function getVersion() {
  return version;
}
