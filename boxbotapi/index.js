"use strict";

const {
  BotAPI,
  EscapeText,
  NewBotAPI,
  NewBotAPIWithAPIEndpoint,
  NewBotAPIWithClient,
  SetHost,
} = require("./bot");
const configs = require("./configs");
const helpers = require("./helpers");
const { HttpGet, HttpGet2Obj, HttpPost } = require("./httplib");
const { SetLogger } = require("./log");
const { Params } = require("./params");
const types = require("./types");
const html = require("./html");

const api = {
  BotAPI,
  EscapeText,
  NewBotAPI,
  NewBotAPIWithAPIEndpoint,
  NewBotAPIWithClient,
  SetHost,

  ChatTyping: configs.ChatTyping,
  CloseConfig: configs.CloseConfig,
  BaseChat: configs.BaseChat,
  BaseEdit: configs.BaseEdit,
  MessageConfig: configs.MessageConfig,
  MessageToFansConfig: configs.MessageToFansConfig,
  EditMessageTextConfig: configs.EditMessageTextConfig,
  UpdateConfig: configs.UpdateConfig,
  CallbackConfig: configs.CallbackConfig,
  ErrAPIForbidden: configs.ErrAPIForbidden,
  ErrBadURL: configs.ErrBadURL,
  ModeHTML: configs.ModeHTML,
  ModeMarkdown: configs.ModeMarkdown,
  ModeMarkdownV2: configs.ModeMarkdownV2,
  ModeRichText: configs.ModeRichText,
  UpdateTypeMessage: configs.UpdateTypeMessage,

  APIEndpoint: configs.state.APIEndpoint,
  Debug: configs.state.Debug,
  MessageListener: configs.state.MessageListener,

  Params,
  HttpGet,
  HttpGet2Obj,
  HttpPost,
  SetLogger,

  ...helpers,
  ...types,
  ...html,
};

Object.defineProperty(api, "APIEndpoint", {
  enumerable: true,
  get() {
    return configs.state.APIEndpoint;
  },
  set(v) {
    configs.setAPIEndpointValue(v);
  },
});

Object.defineProperty(api, "Debug", {
  enumerable: true,
  get() {
    return configs.state.Debug;
  },
  set(v) {
    configs.setDebug(v);
  },
});

Object.defineProperty(api, "MessageListener", {
  enumerable: true,
  get() {
    return configs.state.MessageListener;
  },
  set(v) {
    configs.setMessageListener(v);
  },
});

module.exports = api;
