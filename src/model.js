class Model {
  /** Allows controller to intercept set operations. */
  proxy = null;

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
    navigator.clipboard.writeText(this.password);
  }

  /**
   * Set property using proxy if available.
   * @param {string} prop
   * @param {*} value
   */
  _set(prop, value) {
    if (this.proxy === null) {
      this[prop] = value;
    } else {
      this.proxy[prop] = value;
    }
  }

  newPassword() {
    const password = generatePassword(this.length, 7);
    this._set("password", password);
    this._set("passwordHtml", colorPassword(password));
    this._set("copy", false);
  }
}

const charsets = {
  lower: { chars: "abcdefghijklmnopqrstuvwxyz", mask: 1 },
  upper: { chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ", mask: 2 },
  digit: { chars: "0123456789", mask: 4 },
};

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
