// SPDX-FileCopyrightText: Copyright (c) 2025 Doug Hom
// SPDX-License-Identifier: MIT

class Model {
  /**
   * Use bitwise OR on the masks to determine which charsets are enabled.
   */
  charsets = {
    lower: { chars: "abcdefghijklmnopqrstuvwxyz", mask: 1, default: true },
    upper: { chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ", mask: 2, default: true },
    digit: { chars: "0123456789", mask: 4, default: true },
    symbol: { chars: "!@#$%^&*", mask: 8, default: false },
  };

  get charsetsEnabled() {
    return Object.keys(this.charsets).filter((cs) => this[cs]).length;
  }

  password = "";
  length = 16;

  lower = true;
  upper = true;
  digit = true;
  symbol = false;
  ambiguous = true;

  /** Character set mask. */
  get mask() {
    let mask = 0;
    Object.keys(this.charsets).forEach((cs) => {
      mask |= this[cs] ? this.charsets[cs].mask : 0;
    });
    return mask;
  }

  /** Characters available for password. */
  get characters() {
    let chars = "";

    for (let cs in this.charsets) {
      if (this.mask & this.charsets[cs].mask) {
        chars = chars.concat(this.charsets[cs].chars);
      }
    }

    if (!this.ambiguous) {
      chars = chars.replace(/[0O1Il5S]/g, "");
    }

    return chars;
  }

  get entropy() {
    const entropy = Math.log2(this.characters.length ** this.password.length);
    return Math.round(entropy);
  }

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
        const props = [
          "length",
          "lower",
          "upper",
          "digit",
          "symbol",
          "ambiguous",
        ];
        const result = Reflect.set(...arguments);
        if (props.includes(prop)) {
          obj.newPassword();
        }
        return result;
      },
    };

    let proxy = this;
    if (handler) {
      proxy = new Proxy(this, handler);
    }

    return new Proxy(proxy, refreshPassword);
  }

  /** Return the charset mask of the given password. */
  getCharsetMask(password) {
    let mask = 0;

    for (const char of password) {
      for (const name in this.charsets) {
        const charset = this.charsets[name];
        if (charset.chars.includes(char)) {
          mask |= charset.mask;
          break;
        }
      }
    }

    return mask;
  }

  /**
   * Create a password of the given length.
   * @param {number} length
   * @returns {string}
   */
  generatePassword(length) {
    let randomInts = new Uint32Array(length);

    while (true) {
      let password = "";
      window.crypto.getRandomValues(randomInts);
      randomInts = randomInts.map((i) => i % this.characters.length);

      randomInts.forEach((i) => {
        password = password.concat(this.characters.charAt(i));
      });

      // Password always contains at least one char from each charset.
      if (this.getCharsetMask(password) == this.mask) {
        return password;
      }
    }
  }

  newPassword() {
    this.password = this.generatePassword(this.length);
    this.copy = false;
  }
}

export default Model;
