import model from "./model.js";

class Controller {
  constructor() {
    // Update DOM on model property change
    const updateHtmlDataAttributes = {
      set(obj, prop, value) {
        const attrName = `data-${prop}`;
        document.querySelectorAll(`[${attrName}]`).forEach((element) => {
          element.setAttribute(attrName, value);
        });
        return Reflect.set(obj, prop, value);
      },
    };

    const modelProxy = new Proxy(model, updateHtmlDataAttributes);

    // Update model on user input
    document.querySelectorAll("input").forEach((element) => {
      element.getAttributeNames().forEach((attrName) => {
        if (attrName.startsWith("data-")) {
          attrName = attrName.replace("data-", "");
          switch (element.type) {
            case "range":
              element.addEventListener("input", () => {
                modelProxy[attrName] = element.value;
              });
              break;
          }
        }
      });
    });

    // Run setters on page load.
    Object.assign(modelProxy, modelProxy);
  }
}

export default Controller;
