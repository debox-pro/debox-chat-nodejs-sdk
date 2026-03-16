"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const { Params } = require("../boxbotapi");

test("Params.AddNonEmpty", () => {
  const params = new Params();
  params.AddNonEmpty("value", "value");
  assert.equal(Object.keys(params.toObject()).length, 1);
  assert.equal(params.toObject().value, "value");

  params.AddNonEmpty("test", "");
  assert.equal(Object.keys(params.toObject()).length, 1);
  assert.equal(params.toObject().test, undefined);
});

test("Params.AddNonZero", () => {
  const params = new Params();
  params.AddNonZero("value", 1);
  assert.equal(params.toObject().value, "1");

  params.AddNonZero("test", 0);
  assert.equal(params.toObject().test, undefined);
});

test("Params.AddNonZero64", () => {
  const params = new Params();
  params.AddNonZero64("value", "1");
  assert.equal(params.toObject().value, "1");

  params.AddNonZero64("test", "");
  assert.equal(params.toObject().test, undefined);
});

test("Params.AddBool", () => {
  const params = new Params();
  params.AddBool("value", true);
  assert.equal(params.toObject().value, "true");

  params.AddBool("test", false);
  assert.equal(params.toObject().test, undefined);
});

test("Params.AddNonZeroFloat", () => {
  const params = new Params();
  params.AddNonZeroFloat("value", 1);
  assert.equal(params.toObject().value, "1.000000");

  params.AddNonZeroFloat("test", 0);
  assert.equal(params.toObject().test, undefined);
});

test("Params.AddInterface", () => {
  const params = new Params();
  params.AddInterface("value", { name: "test" });
  assert.equal(params.toObject().value, '{"name":"test"}');

  params.AddInterface("test", null);
  assert.equal(params.toObject().test, undefined);
});

test("Params.AddFirstValid", () => {
  const params = new Params();
  params.AddFirstValid("value", 0, "", "test");
  assert.equal(params.toObject().value, "test");

  params.AddFirstValid("value2", 3, "test");
  assert.equal(params.toObject().value2, "3");
});
