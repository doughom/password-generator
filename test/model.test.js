import { beforeEach, describe, expect, test } from "vitest";
import Model from "../src/model";

describe("Password generator model", () => {
  /**
   * @type {Model}
   */
  let model;
  let hasLower;
  let hasUpper;
  let hasDigit;
  let hasSymbol;

  function testPasswordCharsets() {
    hasLower = /[a-z]/.test(model.password);
    hasUpper = /[A-Z]/.test(model.password);
    hasDigit = /\d/.test(model.password);
    hasSymbol = /[!@#$%^&*]/.test(model.password);
  }

  beforeEach(() => {
    model = new Model();
    model.newPassword();
    testPasswordCharsets();
  });

  test("default password is alphanumeric", () => {
    expect(hasLower && hasUpper && hasDigit && !hasSymbol).toBeTruthy();
    expect(model.charsetsEnabled).toBe(3);
    expect(model.mask).toBe(7);
  });

  test("default password length is 16", () => {
    expect(model.password.length).toBe(16);
    expect(model.length).toBe(16);
  });

  test("change password length", () => {
    model.length = 42;

    expect(model.password.length).toBe(42);
    expect(model.length).toBe(42);
  });

  test("alphanumeric and symbol", () => {
    model.lower = true;
    model.upper = true;
    model.digit = true;
    model.symbol = true;

    testPasswordCharsets();

    expect(hasLower && hasUpper && hasDigit && hasSymbol).toBeTruthy();
    expect(model.charsetsEnabled).toBe(4);
    expect(model.mask).toBe(15);
  });

  test("letters only", () => {
    model.lower = true;
    model.upper = true;
    model.digit = false;
    model.symbol = false;

    testPasswordCharsets();

    expect(hasLower && hasUpper && !hasDigit && !hasSymbol).toBeTruthy();
    expect(model.charsetsEnabled).toBe(2);
    expect(model.mask).toBe(3);
  });

  test("numbers only", () => {
    model.lower = false;
    model.upper = false;
    model.digit = true;
    model.symbol = false;

    testPasswordCharsets();

    expect(!hasLower && !hasUpper && hasDigit && !hasSymbol).toBeTruthy();
    expect(model.charsetsEnabled).toBe(1);
    expect(model.mask).toBe(4);
  });

  test("no ambiguous characters", () => {
    model.length = 1024;
    model.ambiguous = false;

    const hasAmbiguous = /[0O1lI5S]/.test(model.password);

    expect(hasAmbiguous).toBeFalsy();
  });

  test("entropy of 9 digit password", () => {
    model.lower = false;
    model.upper = false;
    model.digit = true;
    model.symbol = false;
    model.length = 9;

    expect(model.entropy).toBe(30);
  });
});
