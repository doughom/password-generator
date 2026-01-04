class Model {
  #length = 16;
  get length() {
    return this.#length;
  }
  set length(value) {
    this.#length = value;
    this.newPassword();
  }

  password = "";
  passwordhtml = "";
  copied = false;

  lower = true;
  upper = true;
  digit = true;

  /** Set by controller so that HTML attributes can be updated */
  proxy = undefined;

  newPassword() {
    this.proxy.password = generatePassword(this.length, 7);
    this.proxy.passwordhtml = colorPassword(this.password);
    this.copied = false;
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
