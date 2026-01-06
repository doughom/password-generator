import Model from "./model.js"; // eslint-disable-line no-unused-vars

class Controller {
  /**
   * @param {Model} model
   */
  constructor(model) {
    // On model property change, update HTML
    const updateHtmlAttributes = {
      set(obj, prop, value) {
        obj[prop] = value;
        document.querySelectorAll(`[data-${prop}]`).forEach((el) => {
          el.dataset.value = value;
        });
        return true;
      },
    };
    const proxy = new Proxy(model, updateHtmlAttributes);
    model.proxy = proxy;
    model = proxy;

    // On input event, update model
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

    const copyButton = document.getElementById("copy");
    copyButton.addEventListener("click", () => {
      model.copy = true;
    });

    // Initial page load
    model.length = 16;
    model.newPassword();
  }
}

export default Controller;
