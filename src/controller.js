class Controller {
  constructor(model) {
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

    model = new Proxy(model, updateHtmlDataAttributes);

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
    Object.assign(model, model);
    model.newPassword();
  }
}

export default Controller;
