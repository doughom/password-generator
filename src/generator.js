// SPDX-FileCopyrightText: Copyright (c) 2025 Doug Hom
// SPDX-License-Identifier: MIT

const charsets = {
  lower: { chars: "abcdefghijklmnopqrstuvwxyz", mask: 1 },
  upper: { chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ", mask: 2 },
  digit: { chars: "0123456789", mask: 4 },
};

/**
 * Create a random password from the specified characters.
 * @param {number} length
 * @param {string} chars
 * @returns {string}
 */
function generatePassword(length, chars) {
  let randomInts = new Uint32Array(length);
  window.crypto.getRandomValues(randomInts);
  randomInts = randomInts.map((i) => i % chars.length);

  let password = "";

  randomInts.forEach((i) => {
    password = password.concat(chars.charAt(i));
  });

  return password;
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

/**
 * Return the characters from the specified character set(s)
 *
 * Valid sets: lower (1), upper (2), digit (4)
 * @param {string} charsetMask bitmask of character set(s)
 * @returns {string}
 */
function getCharacters(charsetMask) {
  let chars = "";

  for (let cs in charsets) {
    if (charsetMask & charsets[cs].mask) {
      chars = chars.concat(charsets[cs].chars);
    }
  }

  return chars;
}

const copyButton = document.getElementById("copy");
const generateButton = document.getElementById("generate");
const passwordField = document.getElementById("password");
const passwordLength = document.getElementById("length");
const lowerSwitch = document.getElementById("lower");
const upperSwitch = document.getElementById("upper");
const digitSwitch = document.getElementById("digit");

copyButton.addEventListener("click", () => {
  navigator.clipboard.writeText(passwordField.innerText);
  copyButton.innerText = "Copied";
  copyButton.classList.add("btn-success");
});

// Reset copy button when password changes.
const passwordObserver = new MutationObserver(() => {
  copyButton.innerText = "Copy";
  copyButton.classList.remove("btn-success");
});
passwordObserver.observe(passwordField, {
  characterData: true,
  childList: true,
});

generateButton.addEventListener("click", () => {
  let mask = 0;
  mask |= lowerSwitch.checked ? charsets.lower.mask : 0;
  mask |= upperSwitch.checked ? charsets.upper.mask : 0;
  mask |= digitSwitch.checked ? charsets.digit.mask : 0;
  const validPasswordChars = getCharacters(mask);

  let password = generatePassword(passwordLength.value, validPasswordChars);
  password = colorPassword(password);
  passwordField.innerHTML = password;
});

// Generate new password when length changes.
passwordLength.addEventListener("input", () => {
  passwordLength.labels[0].innerText = `Characters: ${passwordLength.value}`;
  generateButton.click();
});

// Generate new password when charset changes.
[digitSwitch, lowerSwitch, upperSwitch].forEach((toggle) => {
  toggle.addEventListener("change", () => {
    generateButton.click();
  });
});

// Generate on page load.
generateButton.click();
