// SPDX-FileCopyrightText: Copyright (c) 2025 Doug Hom
// SPDX-License-Identifier: MIT

import Model from "./model.js";
import View from "./view.js";

// On model property change...
const updateHtmlDataAttributes = {
  set(obj, prop, value) {
    const result = Reflect.set(...arguments);

    // Update defined properties.
    document.querySelectorAll(`[data-${prop}]`).forEach((el) => {
      el.dataset.value = value;
      console.log(`update HTML defined prop ${prop} ${value}`);
    });

    // Update calculated properties.
    document
      .querySelectorAll(`[data-key][data-watch="${prop}"]`)
      .forEach((el) => {
        el.dataset.value = obj[el.dataset.bind];
        console.log(`update HTML calculatged prop ${prop} ${value}`);
      });

    return result;
  },
};

const model = new Model(updateHtmlDataAttributes);

// Initialize values from model
// Defined props
for (const key in model) {
  document.querySelectorAll(`[data-${key}`).forEach((el) => {
    if (el.type == "checkbox") {
      console.log("checkbox!");
    } else {
      console.log(`init data-${key} to ${model[key]}`);
      el.dataset.value = model[key];
    }
  });
}

// Calculated props
document.querySelectorAll("[data-key]").forEach((el) => {
  el.dataset.value = model[el.dataset.key];
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
document.querySelectorAll("input[data-key]").forEach((el) => {
  const eventType = inputValueMap[el.type].eventType;
  const valueAttr = inputValueMap[el.type].valueAttr;

  el.addEventListener(eventType, () => {
    model[el.dataset.key] = el[valueAttr];
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
