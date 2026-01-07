// SPDX-FileCopyrightText: Copyright (c) 2025 Doug Hom
// SPDX-License-Identifier: MIT

/**
 * Register custom HTML elements.
 *
 * The elements observe data attributes for changes and update the visuals.
 * Core logic is in the Model class.
 */
class View {
  constructor() {
    customElements.define("pg-charset", CharsetToggle, { extends: "input" });
    customElements.define("pg-copy", CopyButton, { extends: "button" });
    customElements.define("pg-span", CustomSpan, { extends: "span" });
    customElements.define("pg-password", Password, { extends: "span" });
  }
}

/**
 * Span innerHTML is set to data-value.
 */
class CustomSpan extends HTMLSpanElement {
  static observedAttributes = ["data-value"];

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (newValue != "" && newValue != undefined) {
      this.innerHTML = newValue;
      this.setAttribute(attrName, "");
    }
  }
}

class Password extends CustomSpan {
  attributeChangedCallback(attrName, oldValue, newValue) {
    newValue = colorPassword(newValue);
    super.attributeChangedCallback(attrName, oldValue, newValue);
  }
}

class CopyButton extends HTMLButtonElement {
  static observedAttributes = ["data-value"];

  attributeChangedCallback() {
    if (this.dataset.value === "true") {
      this.classList.add("btn-success");
      this.innerText = "Copied";
    } else {
      this.classList.remove("btn-success");
      this.innerText = "Copy";
    }
  }
}

/**
 * Prevent the user from disabling the last remaining enabled charset.
 */
class CharsetToggle extends HTMLInputElement {
  static observedAttributes = ["data-value"];

  attributeChangedCallback() {
    const numCharsetsEnabled = this.dataset.value;
    if (numCharsetsEnabled == 1 && this.checked) {
      this.setAttribute("disabled", true);
    } else {
      this.removeAttribute("disabled");
    }
  }
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

export default View;
