"use strict";

async function readJsonResponse(resp) {
  if (!resp.ok) {
    throw new Error(`wrong http code${resp.status}`);
  }
  return resp.json();
}

async function HttpGet2Obj(url, header, v) {
  const response = await HttpGet(url, header);
  Object.keys(v).forEach((k) => delete v[k]);
  Object.assign(v, response);
}

async function HttpGet(url, header = {}) {
  const resp = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...header,
    },
  });
  return readJsonResponse(resp);
}

async function HttpPost(url, header = {}) {
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...header,
    },
  });
  return readJsonResponse(resp);
}

module.exports = {
  HttpGet,
  HttpGet2Obj,
  HttpPost,
};
