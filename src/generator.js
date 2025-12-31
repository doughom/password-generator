// SPDX-FileCopyrightText: Copyright (c) 2025 Doug Hom
// SPDX-License-Identifier: MIT

class BaseButton extends HTMLButtonElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.addEventListener("click", this.clicked);
  }

  clicked() {
    throw new Error("Not implemented");
  }

  reset() {
    throw new Error("Not implemented");
  }
}

class BaseInput extends HTMLInputElement {
  label;

  constructor() {
    super();
    if (this.labels.length > 0) {
      this.label = this.labels[0];
    }
  }

  connectedCallback() {
    this.addEventListener("input", this.valueChanged);
  }

  valueChanged() {
    throw new Error("Not implemented");
  }
}

class LengthInput extends BaseInput {
  #defaultValue = 15;

  constructor() {
    super();
    this.value = this.#defaultValue;
    this.valueChanged();
  }

  valueChanged() {
    const newText = this.label.innerText.replace(/\d+/, this.value);
    this.label.innerText = newText;
  }
}

class CopyButton extends BaseButton {
  connectedCallback() {
    super.connectedCallback();
    document
      .getElementById("generate")
      ?.addEventListener("click", () => this.reset());
    document
      .getElementById("length")
      ?.addEventListener("input", () => this.reset());
  }

  clicked() {
    const password = document.getElementById("password").innerHTML;
    navigator.clipboard.writeText(password);
    this.innerText = "Copied";
    this.classList.add("btn-success");
  }

  reset() {
    this.innerText = "Copy";
    this.classList.remove("btn-success");
  }
}

class GenerateButton extends BaseButton {
  connectedCallback() {
    super.connectedCallback();
    document
      .getElementById("length")
      ?.addEventListener("input", () => this.clicked());
    this.click();
  }

  clicked() {
    const validPasswordChars = getCharacters("DLU");
    const length = document.getElementById("length")?.value;
    const password = generatePassword(length, validPasswordChars);

    document.getElementById("password").innerHTML = password;
  }
}

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

customElements.define("copy-button", CopyButton, { extends: "button" });
customElements.define("generate-button", GenerateButton, { extends: "button" });
customElements.define("length-input", LengthInput, { extends: "input" });
