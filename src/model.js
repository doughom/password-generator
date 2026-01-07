// SPDX-FileCopyrightText: Copyright (c) 2025 Doug Hom
// SPDX-License-Identifier: MIT

const charsets = {
  lower: { chars: "abcdefghijklmnopqrstuvwxyz", mask: 1 },
  upper: { chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ", mask: 2 },
  digit: { chars: "0123456789", mask: 4 },
};

class Model {
  #proxy = null;
  charsetsEnabled = 0;
  password = "";
  passwordHtml = "";

  _length = 16;
  get length() {
    return this._length;
  }
  set length(value) {
    this._length = value;
    this.newPassword();
  }

  _copy = false;
  get copy() {
    return this._copy;
  }
  set copy(value) {
    this._copy = value;
    navigator.clipboard?.writeText(this.password);
  }

  /**
   * @param {ProxyHandler} handler
   */
  constructor(handler) {
    /**
     * Create charset getters, setters, and backing fields.
     *
     * Each charset can be enabled or disabled. When that happens:
     * - Update charsetsEnabled (number of enabled charsets)
     * - Generate a new password
     */
    for (const charset in charsets) {
      // Backing field.
      Object.defineProperty(this, `_${charset}`, {
        value: true,
        writable: true,
      });

      // Getter and setter.
      Object.defineProperty(this, charset, {
        get: function () {
          return this[`_${charset}`];
        },

        set: function (value) {
          this[`_${charset}`] = value;
          this.charsetsEnabled = Object.keys(charsets).filter(
            (cs) => this[cs],
          ).length;
          this.newPassword();
        },
      });
    }

    this.charsetsEnabled = Object.keys(charsets).filter(
      (cs) => this[cs],
    ).length;

    if (handler) {
      this.#proxy = new Proxy(this, handler);
      return this.#proxy;
    }
  }

  newPassword() {
    let mask = 0;
    Object.keys(charsets).forEach((cs) => {
      mask |= this[cs] ? charsets[cs].mask : 0;
    });

    this.password = generatePassword(this.length, mask);
    this.passwordHtml = colorPassword(this.password);
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
    if (/[a-z]/.test(char)) {
      mask |= charsets.lower.mask;
    } else if (/[A-Z]/.test(char)) {
      mask |= charsets.upper.mask;
    } else if (/\d/.test(char)) {
      mask |= charsets.digit.mask;
    }
  }

  return mask;
}

/**
 * Add color to digits in password.
 * @param {string} password
 * @returns {string} Password with span tags around digits.
 */
function colorPassword(password) {
  let colorized = "";
  const digit = new RegExp(/\d/);

  for (const char of password) {
    if (digit.test(char)) {
      colorized = `${colorized}<span class="text-primary">${char}</span>`;
    } else {
      colorized = `${colorized}${char}`;
    }
  }

  return colorized;
}

export default Model;
