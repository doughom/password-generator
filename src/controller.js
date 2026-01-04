import Model from "./model.js"; // eslint-disable-line no-unused-vars

class Controller {
  /**
   * @param {Model} model
   */
  constructor(model) {
    // Update DOM on model property change
    const updateHtmlDataAttributes = {
      get(obj, prop) {
        return obj[prop];
      },

      set(obj, prop, value) {
        obj[prop] = value;
        const attrName = `data-${prop}`;

        document.querySelectorAll(`[${attrName}]`).forEach((element) => {
          element.setAttribute(attrName, value);
        });

        return true;
      },
    };

    model = new Proxy(model, updateHtmlDataAttributes);
    model.proxy = model;

    // Update model for input elements
    document.querySelectorAll("input").forEach((element) => {
      element.getAttributeNames().forEach((attrName) => {
        if (!attrName.startsWith("data-")) {
          return;
        }

        const propName = attrName.replace("data-", "");
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

        element.addEventListener(type[element.type].eventType, () => {
          model[propName] = element[type[element.type].valueAttr];
        });
      });
    });

    const copyBtn = document.getElementById("copy");
    copyBtn.addEventListener("click", () => {
      model.copied = true;
    });

    const genBtn = document.getElementById("generate");
    genBtn.addEventListener("click", () => {
      model.newPassword();
    });

    // Initial page load
    model.length = model.length; // eslint-disable-line no-self-assign
    model.newPassword();
  }
}

export default Controller;
