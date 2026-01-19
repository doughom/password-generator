// SPDX-FileCopyrightText: Copyright (c) 2025 Doug Hom
// SPDX-License-Identifier: MIT

import "./static/styles.scss";
import * as bootstrap from "bootstrap";

/**
 * Register custom HTML elements.
 *
 * The elements observe data attributes for changes and update the visuals.
 * Core logic is in the Model class.
 */
class View {
  constructor() {
    customElements.define("pg-checkbox", Checkbox);
    customElements.define("pg-charsetcheckbox", CharsetCheckbox);
    customElements.define("pg-copy", CopyButton);
    customElements.define("pg-password", Password);
    customElements.define("pg-length", Length);
    customElements.define("pg-span", Span);

    try {
      [...document.querySelectorAll('[data-bs-toggle="tooltip"]')].map(
        (el) => new bootstrap.Tooltip(el),
      );
    } catch {
      console.warn("Bootstrap was not loaded.");
    }
  }
}

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

class Checkbox extends HTMLElement {
  static observedAttributes = ["data-value"];

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
    // Boolean is only used during initialization.
    if (newValue === "true") {
      this.checkbox.checked = true;
    } else if (newValue === "false") {
      this.checkbox.checked = false;
    }
  }
}

class CharsetCheckbox extends Checkbox {
  static observedAttributes = ["data-value"];

  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(...arguments);

    // Value is boolean during initialization.
    if (!/\d+/.test(newValue)) {
      return;
    }

    // Prevent the user from disabling the last remaining enabled charset.
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
    const colorClass = "btn-success";

    if (this.dataset.value === "true") {
      button.classList.add(colorClass);
      button.innerText = "Copied";
    } else {
      button.classList.remove(colorClass);
      button.innerText = "Copy";
    }
  }
}

/**
 * Add color to password.
 * @param {string} password
 * @returns {string} Password with span tags around digits and symbols.
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
