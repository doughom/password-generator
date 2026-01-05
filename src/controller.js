import Model from "./model.js"; // eslint-disable-line no-unused-vars

class Controller {
  /**
   * @param {Model} model
   */
  constructor(model) {
    const proxy = new Proxy(model, handler);
    model.proxy = proxy;

    // Input elements: update model on event
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

    const generateButton = document.getElementById("generate");
    generateButton.addEventListener("click", () => {
      model.newPassword();
    });

    // Initial page load
    model.newPassword();
  }
}

const handler = {
  set(obj, prop, value) {
    document.querySelectorAll(`[data-${prop}]`).forEach((el) => {
      el.dataset.value = value;
    });
    return true;
  },
};

export default Controller;
