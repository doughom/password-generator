import Model from "./model.js"; // eslint-disable-line no-unused-vars

class Controller {
  /**
   * @param {Model} model
   */
  constructor(model) {
    const proxy = new Proxy(model, handler);
    model.proxy = proxy;

    addInputEventHandlers(proxy);
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

/**
 * Update the model property given by data-key.
 * @param {Model} model
 */
function addInputEventHandlers(model) {
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
}

export default Controller;
