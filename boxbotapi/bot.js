"use strict";

const {
  APIEndpoint,
  isDebug,
  isMessageListener,
  ModeHTML,
  ModeMarkdown,
  ModeMarkdownV2,
  setAPIEndpointValue,
} = require("./configs");
const { Params } = require("./params");
const { APIResponse, ErrorEx, Message, Update, UpdatesChannel, User } = require("./types");

class DefaultHTTPClient {
  async Do(req) {
    const resp = await fetch(req.url, {
      method: req.method,
      headers: req.headers || {},
      body: req.data,
    });
    const body = await resp.text();
    return {
      status_code: resp.status,
      status: resp.statusText || "",
      body,
    };
  }
}

class BotAPI {
  constructor(token, apiEndpoint, client) {
    this.Token = token;
    this.Debug = false;
    this.Buffer = 100;
    this.Self = new User();
    this.Client = client || new DefaultHTTPClient();
    this.apiEndpoint = apiEndpoint;
    this._shutdown = false;
  }

  SetAPIEndpoint(apiEndpoint) {
    this.apiEndpoint = apiEndpoint;
  }

  async MakeRequest(endpoint, params) {
    const p = params instanceof Params ? params : new Params(params || {});

    if (isDebug()) {
      console.log("Endpoint:", endpoint, "params:", p.toObject());
    }

    const methodURL = this.apiEndpoint.replace("%s", this.Token).replace("%s", endpoint);
    const body = new URLSearchParams(p.toObject()).toString();

    const req = {
      method: "POST",
      url: methodURL,
      data: body,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-API-KEY": this.Token,
      },
    };

    const resp = await this.Client.Do(req);

    if (resp.status_code !== 200) {
      throw new ErrorEx({ Code: resp.status_code, Message: resp.status });
    }

    const apiResp = this.decodeAPIResponse(resp.body);

    if (isDebug()) {
      console.log("Endpoint:", endpoint, "response:", resp.body);
    }

    if (!apiResp.Ok) {
      throw new ErrorEx({
        Code: apiResp.ErrorCode,
        Message: apiResp.Message,
        ResponseParametersValue: apiResp.Parameters || undefined,
      });
    }

    return apiResp;
  }

  decodeAPIResponse(responseBody) {
    const payload = typeof responseBody === "string" ? JSON.parse(responseBody) : responseBody;
    return APIResponse.fromJSONDict(payload);
  }

  async GetMe() {
    const resp = await this.MakeRequest("getMe", null);
    return User.fromDict(resp.Result) || new User();
  }

  IsMessageToMe(message) {
    return ((message && message.Text) || "").includes(`@${this.Self.Name}`);
  }

  async Request(c) {
    return this.MakeRequest(c.method(), c.params());
  }

  async Send(c) {
    const resp = await this.Request(c);
    return Message.fromDict(resp.Result) || new Message();
  }

  async GetUpdates(config) {
    const resp = await this.Request(config);
    const updatesRaw = Array.isArray(resp.Result) ? resp.Result : [];
    return updatesRaw.map((item) => Update.fromDict(item)).filter(Boolean);
  }

  async *GetUpdatesChan(config) {
    if (!isMessageListener()) {
      return;
    }

    while (!this._shutdown) {
      let updates = [];
      try {
        updates = await this.GetUpdates(config);
      } catch (err) {
        continue;
      }

      for (const update of updates) {
        if (update.Id >= config.Offset) {
          yield update;
        }
      }
    }
  }

  StopReceivingUpdates() {
    this._shutdown = true;
  }

  ListenForWebhook(pattern) {
    void pattern;
    return new UpdatesChannel();
  }

  ListenForWebhookRespReqFormat(w, r) {
    void w;
    const ch = new UpdatesChannel();
    ch.push(this.HandleUpdate(r));
    return ch;
  }

  HandleUpdate(r) {
    if (!r || r.method !== "POST") {
      throw new Error("wrong HTTP method required POST");
    }

    let payload;
    if (typeof r.body === "string") {
      payload = JSON.parse(r.body);
    } else if (Buffer.isBuffer(r.body)) {
      payload = JSON.parse(r.body.toString("utf8"));
    } else if (r.body && typeof r.body === "object") {
      payload = r.body;
    } else {
      throw new Error("invalid request body");
    }

    const update = Update.fromDict(payload);
    if (!update) {
      throw new Error("invalid update payload");
    }

    return update;
  }
}

function SetHost(host) {
  if (host) {
    setAPIEndpointValue(`${host}/openapi/bot%s/%s`);
  } else {
    console.warn("SetHost error,host is empty,use the default host now");
  }
}

async function NewBotAPI(token) {
  return NewBotAPIWithClient(token, APIEndpoint(), new DefaultHTTPClient());
}

async function NewBotAPIWithAPIEndpoint(token, apiEndpoint) {
  return NewBotAPIWithClient(token, apiEndpoint, new DefaultHTTPClient());
}

async function NewBotAPIWithClient(token, apiEndpoint, client) {
  const bot = new BotAPI(token, apiEndpoint, client);
  bot.Self = await bot.GetMe();
  return bot;
}

function EscapeText(parseMode, text) {
  if (parseMode === ModeHTML) {
    return text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
  }

  if (parseMode === ModeMarkdown) {
    return text.replaceAll("_", "\\_").replaceAll("*", "\\*").replaceAll("`", "\\`").replaceAll("[", "\\[");
  }

  if (parseMode === ModeMarkdownV2) {
    return text
      .replaceAll("_", "\\_")
      .replaceAll("*", "\\*")
      .replaceAll("[", "\\[")
      .replaceAll("]", "\\]")
      .replaceAll("(", "\\(")
      .replaceAll(")", "\\)")
      .replaceAll("~", "\\~")
      .replaceAll("`", "\\`")
      .replaceAll(">", "\\>")
      .replaceAll("#", "\\#")
      .replaceAll("+", "\\+")
      .replaceAll("-", "\\-")
      .replaceAll("=", "\\=")
      .replaceAll("|", "\\|")
      .replaceAll("{", "\\{")
      .replaceAll("}", "\\}")
      .replaceAll(".", "\\.")
      .replaceAll("!", "\\!");
  }

  return "";
}

module.exports = {
  BotAPI,
  DefaultHTTPClient,
  EscapeText,
  NewBotAPI,
  NewBotAPIWithAPIEndpoint,
  NewBotAPIWithClient,
  SetHost,
};
