"use strict";
const crypto = require("node:crypto");

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
  constructor(token, apiSecret, apiEndpoint, client) {
    this.Token = token;
    this.ApiSecret = apiSecret;
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

    const methodURL = this.apiEndpoint.replace("%s", endpoint);
    const body = new URLSearchParams(p.toObject()).toString();
    const { nonce, timestamp, signature } = this.getSignature();

    const req = {
      method: "POST",
      url: methodURL,
      data: body,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-API-KEY": this.Token,
        nonce,
        timestamp,
        signature,
        "X-Request-Id": crypto.randomUUID(),
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

  getSignature() {
    const nonce = String(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER));
    const timestamp = String(Math.floor(Date.now() / 1000));
    const signature = crypto.createHash("sha1").update(`${this.ApiSecret}${nonce}${timestamp}`).digest("hex");
    return { nonce, timestamp, signature };
  }

  decodeAPIResponse(responseBody) {
    const payload = typeof responseBody === "string" ? JSON.parse(responseBody) : responseBody;
    return APIResponse.fromJSONDict(payload);
  }

  async GetMe() {
    const resp = await this.MakeRequest("bot/getMe", null);
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
    setAPIEndpointValue(`${host}/openapi/%s`);
  } else {
    console.warn("SetHost error,host is empty,use the default host now");
  }
}

async function NewBotAPI(token, apiSecret) {
  return NewBotAPIWithClient(token, apiSecret, APIEndpoint(), new DefaultHTTPClient());
}

async function NewBotAPIWithAPIEndpoint(token, apiSecret, apiEndpoint) {
  return NewBotAPIWithClient(token, apiSecret, apiEndpoint, new DefaultHTTPClient());
}

async function NewBotAPIWithClient(token, apiSecret, apiEndpoint, client) {
  const bot = new BotAPI(token, apiSecret, apiEndpoint, client);
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
