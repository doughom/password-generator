class View {
  constructor() {
    customElements.define("pg-copy", CopyButton, { extends: "button" });
    customElements.define("pg-charset", CharsetToggle, { extends: "input" });
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

class CharsetToggle extends HTMLInputElement {
  static observedAttributes = ["data-value"];

  attributeChangedCallback() {
    // Prevent user from disabling the remaining enabled charset.
    const numCharsetsEnabled = this.dataset.value;
    if (numCharsetsEnabled == 1 && this.checked) {
      this.setAttribute("disabled", true);
    } else {
      this.removeAttribute("disabled");
    }
  }
}

export default View;
