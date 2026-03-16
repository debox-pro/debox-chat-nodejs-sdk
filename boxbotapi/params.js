"use strict";

function camelToSnake(name) {
  let out = "";
  for (let i = 0; i < name.length; i += 1) {
    const ch = name[i];
    const isUpper = ch >= "A" && ch <= "Z";
    if (isUpper && i > 0) {
      out += "_";
    }
    out += ch.toLowerCase();
  }
  return out;
}

function toJSONCompatible(value) {
  if (value === null || value === undefined) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((v) => toJSONCompatible(v));
  }

  if (typeof value === "object") {
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      if (v === null || v === undefined || v === "") {
        continue;
      }
      if (v === false) {
        continue;
      }
      if (Array.isArray(v) && v.length === 0) {
        continue;
      }
      if (typeof v === "function") {
        continue;
      }
      out[camelToSnake(k)] = toJSONCompatible(v);
    }
    return out;
  }

  return value;
}

class Params {
  constructor(init) {
    this._data = { ...(init || {}) };
  }

  set(key, value) {
    this._data[key] = value;
  }

  get(key) {
    return this._data[key];
  }

  toObject() {
    return { ...this._data };
  }

  AddNonEmpty(key, value) {
    if (value !== "") {
      this._data[key] = String(value);
    }
  }

  AddNonZero(key, value) {
    if (Number(value) !== 0) {
      this._data[key] = String(value);
    }
  }

  AddNonZero64(key, value) {
    if (value !== "") {
      this._data[key] = String(value);
    }
  }

  AddBool(key, value) {
    if (value) {
      this._data[key] = "true";
    }
  }

  AddNonZeroFloat(key, value) {
    if (Number(value) !== 0) {
      this._data[key] = Number(value).toFixed(6);
    }
  }

  AddInterface(key, value) {
    if (value === null || value === undefined) {
      return;
    }
    this._data[key] = JSON.stringify(toJSONCompatible(value));
  }

  AddFirstValid(key, ...args) {
    for (const arg of args) {
      if (typeof arg === "boolean") {
        if (arg) {
          this._data[key] = "true";
          return;
        }
      } else if (typeof arg === "number") {
        if (arg !== 0) {
          this._data[key] = String(arg);
          return;
        }
      } else if (typeof arg === "string") {
        if (arg !== "") {
          this._data[key] = arg;
          return;
        }
      } else if (arg === null || arg === undefined) {
        continue;
      } else {
        this._data[key] = JSON.stringify(toJSONCompatible(arg));
        return;
      }
    }
  }
}

module.exports = {
  Params,
  camelToSnake,
  toJSONCompatible,
};
