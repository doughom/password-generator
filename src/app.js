// SPDX-FileCopyrightText: Copyright (c) 2025 Doug Hom
// SPDX-License-Identifier: MIT

import Model from "./model.js";
import View from "./view.js";

/**
 * HTML data attributes faciliate communication between the view and the model.
 *
 * There are three special attributes:
 * - data-input: used with input elements to update the model
 * - data-watch: space separated list of model properties to observe
 * - data-key: used with data-watch to read a specific model property
 *
 * Other data attributes are for simple use cases, such as a span that displays
 * the value of one model property without any other logic.
 */

// On model property change...
const updateHtmlDataAttributes = {
  set(obj, prop, value) {
    const result = Reflect.set(...arguments);

    // Update defined properties.
    document.querySelectorAll(`[data-${prop}]`).forEach((el) => {
      el.dataset.value = value;
    });

    // Update calculated properties.
    document
      .querySelectorAll(`[data-key][data-watch*=${prop}]`)
      .forEach((el) => {
        el.dataset.value = obj[el.dataset.key];
      });

    return result;
  },
};

const model = new Model(updateHtmlDataAttributes);

// Initialize values from model
// Defined props
for (const key in model) {
  document.querySelectorAll(`[data-${key}`).forEach((el) => {
    el.dataset.value = model[key];
  });
}

// Calculated props
document.querySelectorAll("[data-key]").forEach((el) => {
  el.dataset.value = model[el.dataset.key];
});

// Input control values
document.querySelectorAll("[data-input]").forEach((el) => {
  el.dataset.value = model[el.dataset.input];
});

model.newPassword();

new View();

const inputValueMap = {
  checkbox: {
    eventType: "change",
    valueAttr: "checked",
  },
  range: {
    eventType: "input",
    valueAttr: "value",
  },
};

// On input event, update model properties.
document.querySelectorAll("input[data-input]").forEach((el) => {
  const eventType = inputValueMap[el.type].eventType;
  const valueAttr = inputValueMap[el.type].valueAttr;

  el.addEventListener(eventType, () => {
    model[el.dataset.input] = el[valueAttr];
  });
});

// Generate button.
document.getElementById("generate").addEventListener("click", () => {
  model.newPassword();
});

// Copy button.
document.getElementById("copy").addEventListener("click", () => {
  model.copy = true;
});
