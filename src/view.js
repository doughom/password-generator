class View {
  constructor() {
    customElements.define("pg-copy", CopyButton, { extends: "button" });
    customElements.define("pg-span", CustomSpan, { extends: "span" });
  }
}

class CustomSpan extends HTMLSpanElement {
  static observedAttributes = ["data-value"];

  connectedCallback() {
    this._render(...arguments);
  }

  attributeChangedCallback() {
    this._render(...arguments);
  }

  _render(attrName, oldValue, newValue) {
    if (newValue != "" && newValue != undefined) {
      this.innerHTML = newValue;
      this.setAttribute(attrName, "");
    }
  }
}

class CopyButton extends HTMLButtonElement {
  static observedAttributes = ["data-value"];

  attributeChangedCallback() {
    if (this.dataset.value === "true") {
      this.classList.add("btn-success");
      this.innerText = "Copied";
    } else {
      this.classList.remove("btn-success");
      this.innerText = "Copy";
    }
  }
}

export default View;
