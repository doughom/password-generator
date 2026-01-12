// SPDX-FileCopyrightText: Copyright (c) 2025 Doug Hom
// SPDX-License-Identifier: MIT

/**
 * Use bitwise OR on the masks to determine which charsets are enabled.
 */
const charsets = {
  lower: { chars: "abcdefghijklmnopqrstuvwxyz", mask: 1, default: true },
  upper: { chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ", mask: 2, default: true },
  digit: { chars: "0123456789", mask: 4, default: true },
  symbol: { chars: "!@#$%^&*", mask: 8, default: false },
};

class Model {
  get charsetsEnabled() {
    const count = Object.keys(charsets).filter((cs) => this[cs]).length;
    console.log(`MODEL charsets enabled: ${count}`);
    return count;
  }

  password = "";
  length = 16;

  lower = true;
  upper = true;
  digit = true;
  symbol = false;

  _copy = false;
  get copy() {
    return this._copy;
  }
  set copy(value) {
    this._copy = value;
    if (value) {
      navigator.clipboard?.writeText(this.password);
    }
  }

  /**
   * @param {ProxyHandler} handler
   */
  constructor(handler) {
    /**
     * Changes to these properties will generate a new password.
     */
    const refreshPassword = {
      set(obj, prop) {
        const props = ["length", "lower", "upper", "digit", "symbol"];
        const result = Reflect.set(...arguments);
        if (props.includes(prop)) {
          obj.newPassword();
        }
        return result;
      },
    };
    const controllerProxy = new Proxy(this, handler);
    return new Proxy(controllerProxy, refreshPassword);
  }

  newPassword() {
    let mask = 0;
    Object.keys(charsets).forEach((cs) => {
      mask |= this[cs] ? charsets[cs].mask : 0;
    });

    this.password = generatePassword(this.length, mask);
    this.copy = false;
  }
}

/**
 * Create a random password with the given charset bitmask.
 * @param {number} length
 * @param {number} charsetMask
 * @returns {string}
 */
function generatePassword(length, charsetMask) {
  let randomInts = new Uint32Array(length);
  let chars = "";

  for (let cs in charsets) {
    if (charsetMask & charsets[cs].mask) {
      chars = chars.concat(charsets[cs].chars);
    }
  }

  while (true) {
    let password = "";
    window.crypto.getRandomValues(randomInts);
    randomInts = randomInts.map((i) => i % chars.length);

    randomInts.forEach((i) => {
      password = password.concat(chars.charAt(i));
    });

    if (getCharsetMask(password) == charsetMask) {
      return password;
    }
  }
}

/**
 * Returns the charset bitmask of the characters in the given password.
 * @param {string} password
 * @returns {number}
 */
function getCharsetMask(password) {
  let mask = 0;

  for (const char of password) {
    for (const name in charsets) {
      const charset = charsets[name];
      if (charset.chars.includes(char)) {
        mask |= charset.mask;
        break;
      }
    }
  }

  return mask;
}

export default Model;
