// SPDX-FileCopyrightText: Copyright (c) 2025 Doug Hom
// SPDX-License-Identifier: MIT

import Model from "./model.js";
import View from "./view.js";

// On model property change, update data attributes in HTML.
const updateHtmlAttributes = {
  set(obj, prop, value) {
    const result = Reflect.set(...arguments);

    // data-prop -> obj.prop
    document.querySelectorAll(`[data-${prop}]`).forEach((el) => {
      el.dataset.value = value;
    });

    // watch-prop -> obj[data-key value]
    document.querySelectorAll(`[watch-${prop}]`).forEach((el) => {
      el.dataset.value = obj[el.dataset.key];
    });

    return result;
  },
};

const model = new Model(updateHtmlAttributes);

// On input event, update model properties.
document.querySelectorAll("input[data-key]").forEach((el) => {
  const type = {
    checkbox: {
      eventType: "change",
      valueAttr: "checked",
    },
    range: {
      eventType: "input",
      valueAttr: "value",
    },
  };

  el.addEventListener(type[el.type].eventType, () => {
    model[el.dataset.key] = el[type[el.type].valueAttr];
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

// Initial page load.
model.newPassword();
new View();
