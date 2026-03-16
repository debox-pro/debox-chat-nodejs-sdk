"use strict";

function SetLogger(logger) {
  if (!logger) {
    throw new Error("logger is nil");
  }
}

module.exports = {
  SetLogger,
};
