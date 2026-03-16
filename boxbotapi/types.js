"use strict";

class ResponseParameters {
  constructor({ MigrateToChatID = 0, RetryAfter = 0 } = {}) {
    this.MigrateToChatID = MigrateToChatID;
    this.RetryAfter = RetryAfter;
  }
}

class APIResponse {
  constructor({ Ok = false, Result = null, ErrorCode = 0, Message = "", Parameters = null } = {}) {
    this.Ok = Ok;
    this.Result = Result;
    this.ErrorCode = ErrorCode;
    this.Message = Message;
    this.Parameters = Parameters;
  }

  static fromJSONDict(data) {
    const params = data && typeof data.parameters === "object" && data.parameters
      ? new ResponseParameters({
          MigrateToChatID: Number(data.parameters.migrate_to_chat_id || 0),
          RetryAfter: Number(data.parameters.retry_after || 0),
        })
      : null;

    return new APIResponse({
      Ok: Boolean(data && data.ok),
      Result: data ? data.result : null,
      ErrorCode: Number((data && data.error_code) || 0),
      Message: String((data && data.message) || ""),
      Parameters: params,
    });
  }
}

class ErrorEx extends Error {
  constructor({ Code = 0, Message = "", ResponseParametersValue = new ResponseParameters(), HTTPCode = 0, RequestID = "" } = {}) {
    super(Message);
    this.Code = Code;
    this.Message = Message;
    this.ResponseParameters = ResponseParametersValue;
    this.HTTPCode = HTTPCode;
    this.RequestID = RequestID;
  }

  String() {
    return JSON.stringify(
      {
        errorCode: this.Code,
        errorMessage: this.Message,
        httpCode: this.HTTPCode,
        requestID: this.RequestID,
        responseParameters: {
          migrate_to_chat_id: this.ResponseParameters.MigrateToChatID,
          retry_after: this.ResponseParameters.RetryAfter,
        },
      },
      null,
      4,
    );
  }
}

class User {
  constructor({ UserId = "", IsBot = false, Name = "", Address = "", Pic = "", LanguageCode = "" } = {}) {
    this.UserId = UserId;
    this.IsBot = IsBot;
    this.Name = Name;
    this.Address = Address;
    this.Pic = Pic;
    this.LanguageCode = LanguageCode;
  }

  String() {
    return this.Name || "";
  }

  static fromDict(data) {
    if (!data || typeof data !== "object") {
      return null;
    }

    return new User({
      UserId: String(data.user_id || ""),
      IsBot: Boolean(data.is_bot),
      Name: String(data.name || ""),
      Address: String(data.address || ""),
      Pic: String(data.pic || ""),
      LanguageCode: String(data.language_code || ""),
    });
  }
}

class Chat {
  constructor({
    ID = "",
    Type = "",
    Title = "",
    UserName = "",
    FirstName = "",
    LastName = "",
    Bio = "",
    HasPrivateForwards = false,
    Description = "",
    InviteLink = "",
    SlowModeDelay = 0,
    MessageAutoDeleteTime = 0,
    HasProtectedContent = false,
    StickerSetName = "",
    CanSetStickerSet = false,
    LinkedChatID = 0,
  } = {}) {
    this.ID = ID;
    this.Type = Type;
    this.Title = Title;
    this.UserName = UserName;
    this.FirstName = FirstName;
    this.LastName = LastName;
    this.Bio = Bio;
    this.HasPrivateForwards = HasPrivateForwards;
    this.Description = Description;
    this.InviteLink = InviteLink;
    this.SlowModeDelay = SlowModeDelay;
    this.MessageAutoDeleteTime = MessageAutoDeleteTime;
    this.HasProtectedContent = HasProtectedContent;
    this.StickerSetName = StickerSetName;
    this.CanSetStickerSet = CanSetStickerSet;
    this.LinkedChatID = LinkedChatID;
  }

  IsPrivate() {
    return this.Type === "private";
  }

  IsGroup() {
    return this.Type === "group";
  }

  IsSuperGroup() {
    return this.Type === "supergroup";
  }

  IsChannel() {
    return this.Type === "channel";
  }

  static fromDict(data) {
    if (!data || typeof data !== "object") {
      return null;
    }

    return new Chat({
      ID: String(data.id || ""),
      Type: String(data.type || ""),
      Title: String(data.title || ""),
      UserName: String(data.username || ""),
      FirstName: String(data.first_name || ""),
      LastName: String(data.last_name || ""),
      Bio: String(data.bio || ""),
      HasPrivateForwards: Boolean(data.has_private_forwards),
      Description: String(data.description || ""),
      InviteLink: String(data.invite_link || ""),
      SlowModeDelay: Number(data.slow_mode_delay || 0),
      MessageAutoDeleteTime: Number(data.message_auto_delete_time || 0),
      HasProtectedContent: Boolean(data.has_protected_content),
      StickerSetName: String(data.sticker_set_name || ""),
      CanSetStickerSet: Boolean(data.can_set_sticker_set),
      LinkedChatID: Number(data.linked_chat_id || 0),
    });
  }
}

class KeyboardButton {
  constructor({ Text = "", RequestContact = false, RequestLocation = false, RequestPoll = null } = {}) {
    this.Text = Text;
    this.RequestContact = RequestContact;
    this.RequestLocation = RequestLocation;
    this.RequestPoll = RequestPoll;
  }
}

class ReplyKeyboardMarkup {
  constructor({ Keyboard = [], ResizeKeyboard = false, OneTimeKeyboard = false, InputFieldPlaceholder = "", Selective = false } = {}) {
    this.Keyboard = Keyboard;
    this.ResizeKeyboard = ResizeKeyboard;
    this.OneTimeKeyboard = OneTimeKeyboard;
    this.InputFieldPlaceholder = InputFieldPlaceholder;
    this.Selective = Selective;
  }
}

class ReplyKeyboardRemove {
  constructor({ RemoveKeyboard = true, Selective = false } = {}) {
    this.RemoveKeyboard = RemoveKeyboard;
    this.Selective = Selective;
  }
}

class LoginURL {
  constructor({ URL = "", ForwardText = "", BotUsername = "", RequestWriteAccess = false } = {}) {
    this.URL = URL;
    this.ForwardText = ForwardText;
    this.BotUsername = BotUsername;
    this.RequestWriteAccess = RequestWriteAccess;
  }
}

class InlineKeyboardButton {
  constructor({
    Text = "",
    URL = null,
    SubText = "",
    SubTextColor = "",
    LoginURLValue = null,
    CallbackData = null,
    SwitchInlineQuery = null,
    SwitchInlineQueryCurrentChat = null,
    Pay = false,
  } = {}) {
    this.Text = Text;
    this.URL = URL;
    this.SubText = SubText;
    this.SubTextColor = SubTextColor;
    this.LoginURL = LoginURLValue;
    this.CallbackData = CallbackData;
    this.SwitchInlineQuery = SwitchInlineQuery;
    this.SwitchInlineQueryCurrentChat = SwitchInlineQueryCurrentChat;
    this.Pay = Pay;
  }
}

class InlineKeyboardMarkup {
  constructor({ InlineKeyboard = [], FontSize = "", FontColor = "" } = {}) {
    this.InlineKeyboard = InlineKeyboard;
    this.FontSize = FontSize;
    this.FontColor = FontColor;
  }
}

class CallbackQuery {
  constructor({ ID = "", From = null, Message = null, InlineMessageID = "", ChatInstance = "", Data = "", GameShortName = "" } = {}) {
    this.ID = ID;
    this.From = From;
    this.Message = Message;
    this.InlineMessageID = InlineMessageID;
    this.ChatInstance = ChatInstance;
    this.Data = Data;
    this.GameShortName = GameShortName;
  }

  static fromDict(data) {
    if (!data || typeof data !== "object") {
      return null;
    }

    return new CallbackQuery({
      ID: String(data.id || ""),
      From: User.fromDict(data.from),
      Message: Message.fromDict(data.message),
      InlineMessageID: String(data.inline_message_id || ""),
      ChatInstance: String(data.chat_instance || ""),
      Data: String(data.data || ""),
      GameShortName: String(data.game_short_name || ""),
    });
  }
}

class Message {
  constructor({
    MessageID = "",
    Text = "",
    TextRaw = "",
    MentionUsers = [],
    From = null,
    ChatValue = null,
    DateValue = 0,
    ReplyMarkup = null,
  } = {}) {
    this.MessageID = MessageID;
    this.Text = Text;
    this.TextRaw = TextRaw;
    this.MentionUsers = MentionUsers;
    this.From = From;
    this.Chat = ChatValue;
    this.Date = DateValue;
    this.ReplyMarkup = ReplyMarkup;
  }

  Time() {
    return new Date(this.Date * 1000);
  }

  static fromDict(data) {
    if (!data || typeof data !== "object") {
      return null;
    }

    const mentionUsers = Array.isArray(data.mention_users)
      ? data.mention_users.map((u) => User.fromDict(u)).filter(Boolean)
      : [];

    return new Message({
      MessageID: String(data.message_id || ""),
      Text: String(data.text || ""),
      TextRaw: String(data.text_raw || ""),
      MentionUsers: mentionUsers,
      From: User.fromDict(data.from),
      ChatValue: Chat.fromDict(data.chat),
      DateValue: Number(data.date || 0),
      ReplyMarkup: inlineMarkupFromDict(data.reply_markup),
    });
  }
}

class Update {
  constructor({ Id = 0, MessageValue = null, CallbackQueryValue = null } = {}) {
    this.Id = Id;
    this.Message = MessageValue;
    this.CallbackQuery = CallbackQueryValue;
  }

  SentFrom() {
    if (this.Message) {
      return this.Message.From;
    }
    if (this.CallbackQuery) {
      return this.CallbackQuery.From;
    }
    return null;
  }

  CallbackData() {
    if (this.CallbackQuery) {
      return this.CallbackQuery.Data;
    }
    return "";
  }

  FromChat() {
    if (this.Message) {
      return this.Message.Chat;
    }
    if (this.CallbackQuery && this.CallbackQuery.Message) {
      return this.CallbackQuery.Message.Chat;
    }
    return null;
  }

  static fromDict(data) {
    if (!data || typeof data !== "object") {
      return null;
    }

    return new Update({
      Id: Number(data.id || 0),
      MessageValue: Message.fromDict(data.message),
      CallbackQueryValue: CallbackQuery.fromDict(data.callback_query),
    });
  }
}

class UpdatesChannel extends Array {
  Clear() {
    this.length = 0;
  }
}

function inlineMarkupFromDict(data) {
  if (!data || typeof data !== "object") {
    return null;
  }

  const rows = Array.isArray(data.inline_keyboard)
    ? data.inline_keyboard.map((row) => {
        if (!Array.isArray(row)) {
          return [];
        }

        return row.map((b) => {
          const loginURL = b && typeof b.login_url === "object"
            ? new LoginURL({
                URL: String(b.login_url.url || ""),
                ForwardText: String(b.login_url.forward_text || ""),
                BotUsername: String(b.login_url.bot_username || ""),
                RequestWriteAccess: Boolean(b.login_url.request_write_access),
              })
            : null;

          return new InlineKeyboardButton({
            Text: String((b && b.text) || ""),
            URL: b && b.url ? String(b.url) : null,
            SubText: String((b && b.sub_text) || ""),
            SubTextColor: String((b && b.sub_text_color) || ""),
            LoginURLValue: loginURL,
            CallbackData: b && b.callback_data ? String(b.callback_data) : null,
            SwitchInlineQuery: b && b.switch_inline_query ? String(b.switch_inline_query) : null,
            SwitchInlineQueryCurrentChat: b && b.switch_inline_query_current_chat ? String(b.switch_inline_query_current_chat) : null,
            Pay: Boolean(b && b.pay),
          });
        });
      })
    : [];

  return new InlineKeyboardMarkup({
    InlineKeyboard: rows,
    FontSize: String(data.font_size || ""),
    FontColor: String(data.font_color || ""),
  });
}

module.exports = {
  APIResponse,
  CallbackQuery,
  Chat,
  ErrorEx,
  InlineKeyboardButton,
  InlineKeyboardMarkup,
  KeyboardButton,
  LoginURL,
  Message,
  ReplyKeyboardMarkup,
  ReplyKeyboardRemove,
  ResponseParameters,
  Update,
  UpdatesChannel,
  User,
  inlineMarkupFromDict,
};
