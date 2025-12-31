// SPDX-FileCopyrightText: Copyright (c) 2025 Doug Hom
// SPDX-License-Identifier: MIT

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
 * Valid sets: (D)igits, (L)ower, and (U)pper
 * @param {string} charSets D, L, and/or U
 * @returns {string}
 */
function getCharacters(charSets) {
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const digit = "0123456789";

  let chars = "";

  if (charSets.includes("D")) {
    chars = chars.concat(digit);
  }
  if (charSets.includes("L")) {
    chars = chars.concat(lower);
  }
  if (charSets.includes("U")) {
    chars = chars.concat(upper);
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
  const digit = digitSwitch.checked ? "D" : "";
  const lower = lowerSwitch.checked ? "L" : "";
  const upper = upperSwitch.checked ? "U" : "";
  const validPasswordChars = getCharacters(`${digit}${lower}${upper}`);

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
