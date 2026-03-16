"use strict";

const { Params } = require("./params");

const state = {
  APIEndpoint: "https://open.debox.pro/openapi/bot%s/%s",
  Debug: false,
  MessageListener: false,
};

const ChatTyping = "typing";
const ErrAPIForbidden = "forbidden";
const ModeMarkdown = "Markdown";
const ModeMarkdownV2 = "MarkdownV2";
const ModeHTML = "HTML";
const ModeRichText = "richtext";
const UpdateTypeMessage = "message";
const ErrBadURL = "bad or empty url";

class CloseConfig {
  method() {
    return "close";
  }

  params() {
    return new Params();
  }
}

class BaseChat {
  constructor({ ChatID = "", ChatType = "", ChannelUsername = "", ReplyMarkup = null } = {}) {
    this.ChatID = ChatID;
    this.ChatType = ChatType;
    this.ChannelUsername = ChannelUsername;
    this.ReplyMarkup = ReplyMarkup;
  }

  params() {
    const params = new Params();
    params.AddFirstValid("chat_id", this.ChatID, this.ChannelUsername);
    params.AddFirstValid("chat_type", this.ChatType, this.ChannelUsername);
    params.AddInterface("reply_markup", this.ReplyMarkup);
    return params;
  }
}

class BaseEdit {
  constructor({
    ChatID = "",
    ChatType = "",
    ChannelUsername = "",
    MessageID = "",
    InlineMessageID = "",
    ReplyMarkup = null,
  } = {}) {
    this.ChatID = ChatID;
    this.ChatType = ChatType;
    this.ChannelUsername = ChannelUsername;
    this.MessageID = MessageID;
    this.InlineMessageID = InlineMessageID;
    this.ReplyMarkup = ReplyMarkup;
  }

  params() {
    const params = new Params();
    if (this.InlineMessageID) {
      params.set("inline_message_id", this.InlineMessageID);
    } else {
      params.AddFirstValid("chat_id", this.ChatID, this.ChannelUsername);
      params.AddFirstValid("chat_type", this.ChatType, this.ChannelUsername);
      params.AddFirstValid("message_id", this.MessageID);
    }
    params.AddInterface("reply_markup", this.ReplyMarkup);
    return params;
  }
}

class MessageConfig {
  constructor({ BaseChatValue = new BaseChat(), Text = "", ParseMode = "" } = {}) {
    this.BaseChat = BaseChatValue;
    this.Text = Text;
    this.ParseMode = ParseMode;
  }

  get ReplyMarkup() {
    return this.BaseChat.ReplyMarkup;
  }

  set ReplyMarkup(value) {
    this.BaseChat.ReplyMarkup = value;
  }

  get ChatID() {
    return this.BaseChat.ChatID;
  }

  set ChatID(value) {
    this.BaseChat.ChatID = value;
  }

  get ChatType() {
    return this.BaseChat.ChatType;
  }

  set ChatType(value) {
    this.BaseChat.ChatType = value;
  }

  get ChannelUsername() {
    return this.BaseChat.ChannelUsername;
  }

  set ChannelUsername(value) {
    this.BaseChat.ChannelUsername = value;
  }

  params() {
    const params = this.BaseChat.params();
    params.AddNonEmpty("text", this.Text);
    params.AddNonEmpty("parse_mode", this.ParseMode);
    return params;
  }

  method() {
    return "sendMessage";
  }
}

class MessageToFansConfig extends MessageConfig {
  method() {
    return "sendMessageToFans";
  }
}

class EditMessageTextConfig {
  constructor({ BaseEditValue = new BaseEdit(), Text = "", ParseMode = "" } = {}) {
    this.BaseEdit = BaseEditValue;
    this.Text = Text;
    this.ParseMode = ParseMode;
  }

  get ReplyMarkup() {
    return this.BaseEdit.ReplyMarkup;
  }

  set ReplyMarkup(value) {
    this.BaseEdit.ReplyMarkup = value;
  }

  get ChatID() {
    return this.BaseEdit.ChatID;
  }

  set ChatID(value) {
    this.BaseEdit.ChatID = value;
  }

  get ChatType() {
    return this.BaseEdit.ChatType;
  }

  set ChatType(value) {
    this.BaseEdit.ChatType = value;
  }

  get ChannelUsername() {
    return this.BaseEdit.ChannelUsername;
  }

  set ChannelUsername(value) {
    this.BaseEdit.ChannelUsername = value;
  }

  get MessageID() {
    return this.BaseEdit.MessageID;
  }

  set MessageID(value) {
    this.BaseEdit.MessageID = value;
  }

  get InlineMessageID() {
    return this.BaseEdit.InlineMessageID;
  }

  set InlineMessageID(value) {
    this.BaseEdit.InlineMessageID = value;
  }

  params() {
    const params = this.BaseEdit.params();
    params.set("text", this.Text);
    params.AddNonEmpty("parse_mode", this.ParseMode);
    return params;
  }

  method() {
    return "editMessageText";
  }
}

class UpdateConfig {
  constructor({ Offset = 0, Limit = 0, Timeout = 0, AllowedUpdates = [] } = {}) {
    this.Offset = Offset;
    this.Limit = Limit;
    this.Timeout = Timeout;
    this.AllowedUpdates = AllowedUpdates;
  }

  method() {
    return "getUpdates";
  }

  params() {
    const params = new Params();
    params.AddNonZero("offset", this.Offset);
    params.AddNonZero("limit", this.Limit);
    params.AddNonZero("timeout", this.Timeout);
    params.AddInterface("allowed_updates", this.AllowedUpdates);
    return params;
  }
}

class CallbackConfig {
  constructor({ CallbackQueryID = "", Text = "", ShowAlert = false, URL = "", CacheTime = 0 } = {}) {
    this.CallbackQueryID = CallbackQueryID;
    this.Text = Text;
    this.ShowAlert = ShowAlert;
    this.URL = URL;
    this.CacheTime = CacheTime;
  }

  method() {
    return "answerCallbackQuery";
  }

  params() {
    const params = new Params();
    params.set("callback_query_id", this.CallbackQueryID);
    params.AddNonEmpty("text", this.Text);
    params.AddBool("show_alert", this.ShowAlert);
    params.AddNonEmpty("url", this.URL);
    params.AddNonZero("cache_time", this.CacheTime);
    return params;
  }
}

module.exports = {
  state,
  APIEndpoint: () => state.APIEndpoint,
  setAPIEndpointValue: (value) => {
    state.APIEndpoint = value;
  },
  isDebug: () => state.Debug,
  setDebug: (value) => {
    state.Debug = Boolean(value);
  },
  isMessageListener: () => state.MessageListener,
  setMessageListener: (value) => {
    state.MessageListener = Boolean(value);
  },
  ChatTyping,
  CloseConfig,
  ErrAPIForbidden,
  ErrBadURL,
  MessageConfig,
  MessageToFansConfig,
  BaseChat,
  BaseEdit,
  EditMessageTextConfig,
  ModeHTML,
  ModeMarkdown,
  ModeMarkdownV2,
  ModeRichText,
  UpdateConfig,
  UpdateTypeMessage,
  CallbackConfig,
};
