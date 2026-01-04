import Model from "./model.js";

class Controller {
  constructor(m) {
    // Autocomplete helper
    let model = new Model();
    model = m;

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

    // Update model on user input
    document.querySelectorAll("input").forEach((element) => {
      element.getAttributeNames().forEach((attrName) => {
        if (!attrName.startsWith("data-")) {
          return;
        }

        const propName = attrName.replace("data-", "");
        const eventMap = {
          button: "click",
          checkbox: "change",
          range: "input",
        };

        element.addEventListener(eventMap[element.type], () => {
          model[propName] = element.value;
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
