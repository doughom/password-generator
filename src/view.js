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
    customElements.define("pg-charset", CharsetToggle);
    customElements.define("pg-copy", CopyButton);
    customElements.define("pg-span", Span);
    customElements.define("pg-password", Password);
  }
}

/**
 * Span innerHTML is set to data-value.
 */
class Span extends HTMLElement {
  static observedAttributes = ["data-value"];

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (newValue != "" && newValue != undefined) {
      this.innerHTML = newValue;
      this.setAttribute(attrName, "");
    }
  }
}

class Password extends Span {
  attributeChangedCallback(attrName, oldValue, newValue) {
    newValue = colorPassword(newValue);
    super.attributeChangedCallback(attrName, oldValue, newValue);
  }
}

class CopyButton extends HTMLElement {
  static observedAttributes = ["data-value"];

  attributeChangedCallback() {
    const button = this.firstElementChild;
    if (this.dataset.value === "true") {
      button.classList.add("btn-success");
      button.innerText = "Copied";
    } else {
      button.classList.remove("btn-success");
      button.innerText = "Copy";
    }
  }
}

/**
 * Prevent the user from disabling the last remaining enabled charset.
 */
class CharsetToggle extends HTMLElement {
  static observedAttributes = ["data-value"];

  attributeChangedCallback() {
    const input = this.firstElementChild;
    const numCharsetsEnabled = this.dataset.value;

    if (numCharsetsEnabled == 1 && input.checked) {
      input.setAttribute("disabled", true);
    } else {
      input.removeAttribute("disabled");
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
