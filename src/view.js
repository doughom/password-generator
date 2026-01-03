/**
 * Display the value of a model property.
 *
 * - data-property: name of property from the model
 */
class CustomSpan extends HTMLSpanElement {
  connectedCallback() {
    observeAttributes(this);
  }

  render() {
    const propName = this.getAttribute("data-property");
    this.innerHTML = this.getAttribute(`data-${propName}`);
  }
}

/**
 * Call the node's render function when attributes change.
 * @param {Node} node The node being observed
 */
function observeAttributes(node) {
  const observer = new MutationObserver((mutationRecords) => {
    mutationRecords.forEach(() => {
      node.render();
    });
  });
  observer.observe(node, { attributes: true });
}

class View {
  constructor() {
    customElements.define("pg-span", CustomSpan, { extends: "span" });
  }
}

export default View;
