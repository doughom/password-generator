/**
 * Display the value of a model property.
 *
 * Only use one data attribute on the element.
 */
class CustomSpan extends HTMLSpanElement {
  connectedCallback() {
    observeAttributes(this);
  }

  render() {
    this.getAttributeNames().forEach((attr) => {
      if (attr.startsWith("data-")) {
        this.innerHTML = this.getAttribute(attr);
      }
    });
  }
}

/**
 * Handle clipboard and button style.
 */
class CopyButton extends HTMLButtonElement {
  connectedCallback() {
    observeAttributes(this);
  }

  render() {
    if (this.getAttribute("data-copied") === "true") {
      const password = this.getAttribute("data-password");
      navigator.clipboard.writeText(password);
      this.innerText = "Copied";
      this.classList.add("btn-success");
    } else {
      this.innerText = "Copy";
      this.classList.remove("btn-success");
    }
  }
}

/**
 * Call the node's render function when data attributes change.
 * @param {Node} node The node being observed
 */
function observeAttributes(node) {
  const observer = new MutationObserver((mutationRecords) => {
    mutationRecords.forEach((record) => {
      if (record.attributeName.startsWith("data-")) {
        node.render();
      }
    });
  });
  observer.observe(node, { attributes: true });
}

class View {
  constructor() {
    customElements.define("pg-span", CustomSpan, { extends: "span" });
    customElements.define("pg-copy", CopyButton, { extends: "button" });
  }
}

export default View;
