class View {
  constructor() {
    customElements.define("pg-span", CustomSpan, { extends: "span" });
  }
}

class CustomSpan extends HTMLSpanElement {
  static observedAttributes = ["data-value"];

  constructor() {
    super();
  }

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

export default View;
