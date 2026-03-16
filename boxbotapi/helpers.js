"use strict";

const {
  BaseChat,
  BaseEdit,
  CallbackConfig,
  EditMessageTextConfig,
  MessageConfig,
  MessageToFansConfig,
  UpdateConfig,
} = require("./configs");
const {
  InlineKeyboardButton,
  InlineKeyboardMarkup,
  KeyboardButton,
  ReplyKeyboardMarkup,
  ReplyKeyboardRemove,
} = require("./types");

function NewMessage(chatID, chatType, text) {
  return new MessageConfig({
    BaseChatValue: new BaseChat({ ChatID: chatID, ChatType: chatType }),
    Text: text,
  });
}

function NewMessageResponse(message) {
  const chatID = message && message.Chat ? message.Chat.ID : "";
  const chatType = message && message.Chat ? message.Chat.Type : "";
  return new MessageConfig({
    BaseChatValue: new BaseChat({ ChatID: chatID, ChatType: chatType }),
    Text: (message && message.Text) || "",
  });
}

function NewMessageToFans(chatID, chatType, text) {
  return new MessageToFansConfig({
    BaseChatValue: new BaseChat({ ChatID: chatID, ChatType: chatType }),
    Text: text,
  });
}

function NewEditMessageText(chatID, chatType, messageID, text) {
  return new EditMessageTextConfig({
    BaseEditValue: new BaseEdit({ ChatID: chatID, ChatType: chatType, MessageID: messageID }),
    Text: text,
  });
}

function NewEditMessageTextAndMarkup(chatID, chatType, messageID, text, replyMarkup) {
  return new EditMessageTextConfig({
    BaseEditValue: new BaseEdit({
      ChatID: chatID,
      ChatType: chatType,
      MessageID: messageID,
      ReplyMarkup: replyMarkup,
    }),
    Text: text,
  });
}

function NewMessageToChannel(username, text) {
  return new MessageConfig({
    BaseChatValue: new BaseChat({ ChannelUsername: username }),
    Text: text,
  });
}

function NewUpdate(offset) {
  return new UpdateConfig({ Offset: offset, Limit: 0, Timeout: 0 });
}

function NewRemoveKeyboard(selective) {
  return new ReplyKeyboardRemove({ RemoveKeyboard: true, Selective: selective });
}

function NewKeyboardButton(text) {
  return new KeyboardButton({ Text: text });
}

function NewKeyboardButtonContact(text) {
  return new KeyboardButton({ Text: text, RequestContact: true });
}

function NewKeyboardButtonLocation(text) {
  return new KeyboardButton({ Text: text, RequestLocation: true });
}

function NewKeyboardButtonRow(...buttons) {
  return [...buttons];
}

function NewReplyKeyboard(...rows) {
  return new ReplyKeyboardMarkup({ ResizeKeyboard: true, Keyboard: [...rows] });
}

function NewOneTimeReplyKeyboard(...rows) {
  const markup = NewReplyKeyboard(...rows);
  markup.OneTimeKeyboard = true;
  return markup;
}

function NewInlineKeyboardButtonData(text, data) {
  return new InlineKeyboardButton({ Text: text, CallbackData: data });
}

function NewInlineKeyboardButtonDataWithColor(text, data, url, subText, subTextColor) {
  return new InlineKeyboardButton({
    Text: text,
    CallbackData: data,
    URL: url,
    SubText: subText,
    SubTextColor: subTextColor,
  });
}

function NewInlineKeyboardButtonLoginURL(text, loginURL) {
  return new InlineKeyboardButton({ Text: text, LoginURLValue: loginURL });
}

function NewInlineKeyboardButtonURL(text, url) {
  return new InlineKeyboardButton({ Text: text, URL: url });
}

function NewInlineKeyboardButtonSwitch(text, sw) {
  return new InlineKeyboardButton({ Text: text, SwitchInlineQuery: sw });
}

function NewInlineKeyboardRow(...buttons) {
  return [...buttons];
}

function NewInlineKeyboardMarkup(...rows) {
  return new InlineKeyboardMarkup({ InlineKeyboard: [...rows] });
}

function NewCallback(id, text) {
  return new CallbackConfig({ CallbackQueryID: id, Text: text, ShowAlert: false });
}

function NewCallbackWithAlert(id, text) {
  return new CallbackConfig({ CallbackQueryID: id, Text: text, ShowAlert: true });
}

module.exports = {
  NewCallback,
  NewCallbackWithAlert,
  NewEditMessageText,
  NewEditMessageTextAndMarkup,
  NewInlineKeyboardButtonData,
  NewInlineKeyboardButtonDataWithColor,
  NewInlineKeyboardButtonLoginURL,
  NewInlineKeyboardButtonSwitch,
  NewInlineKeyboardButtonURL,
  NewInlineKeyboardMarkup,
  NewInlineKeyboardRow,
  NewKeyboardButton,
  NewKeyboardButtonContact,
  NewKeyboardButtonLocation,
  NewKeyboardButtonRow,
  NewMessage,
  NewMessageResponse,
  NewMessageToChannel,
  NewMessageToFans,
  NewOneTimeReplyKeyboard,
  NewRemoveKeyboard,
  NewReplyKeyboard,
  NewUpdate,
};
