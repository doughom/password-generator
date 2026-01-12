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
    customElements.define("pg-charsetcheckbox", CharsetCheckbox);
    customElements.define("pg-copy", CopyButton);
    customElements.define("pg-password", Password);
    customElements.define("pg-length", Length);
    customElements.define("pg-span", Span);
  }
}

/**
 * Span innerHTML is set to data-value.
 */
class Span extends HTMLElement {
  static observedAttributes = ["data-value"];

  attributeChangedCallback(attrName, oldValue, newValue) {
    // Move value inside the element.
    if (newValue != "" && newValue != undefined) {
      this.innerHTML = newValue;
      this.dataset.value = "";
    }
  }
}

class Password extends Span {
  attributeChangedCallback(attrName, oldValue, newValue) {
    newValue = colorPassword(newValue);
    super.attributeChangedCallback(attrName, oldValue, newValue);
  }
}

class Length extends HTMLElement {
  #range;

  constructor() {
    super();
    const attrs = {
      id: "length",
      type: "range",
      min: 8,
      max: 64,
      step: 1,
    };
    this.#range = document.createElement("input");
    Object.assign(this.#range, attrs);
    this.#range.classList.add("form-range");
  }

  connectedCallback() {
    // Move attributes into child element.
    this.#range.value = this.dataset.value;
    this.removeAttribute("data-value");

    this.#range.dataset.input = this.dataset.input;
    this.removeAttribute("data-input");

    this.appendChild(this.#range);
  }
}

class BaseCheckbox extends HTMLElement {
  checkbox;

  constructor() {
    super();
    const attrs = {
      type: "checkbox",
      role: "switch",
    };

    this.checkbox = document.createElement("input");
    Object.assign(this.checkbox, attrs);
    this.checkbox.classList.add("form-check-input");

    // Copy data attribute to checkbox so it can update the model.
    this.checkbox.dataset.input = this.dataset.input;
  }

  connectedCallback() {
    this.appendChild(this.checkbox);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // true/false is only used during initialization.
    if (newValue === "true") {
      this.checkbox.checked = true;
    } else if (newValue === "false") {
      this.checkbox.checked = false;
    }
  }
}

class CharsetCheckbox extends BaseCheckbox {
  static observedAttributes = ["data-value"];

  // Prevent the user from disabling the last remaining enabled charset.
  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(...arguments);
    if (!/\d+/.test(newValue)) {
      return;
    }

    const numCharsetsEnabled = newValue;
    if (numCharsetsEnabled == 1 && this.checkbox.checked) {
      this.checkbox.setAttribute("disabled", true);
    } else {
      this.checkbox.removeAttribute("disabled");
    }
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
  const symbol = new RegExp(/[^A-Za-z0-9]/);

  for (const char of password) {
    if (digit.test(char)) {
      colorized = `${colorized}<span class="text-primary">${char}</span>`;
    } else if (symbol.test(char)) {
      colorized = `${colorized}<span class="text-danger">${char}</span>`;
    } else {
      colorized = `${colorized}${char}`;
    }
  }

  return colorized;
}

export default View;
