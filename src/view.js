/**
 * Label element with innerText "Name: Value"
 *
 * - data-name: name
 * - data-value: attribute name containing the value
 */
class GenLabel extends HTMLLabelElement {
  connectedCallback() {
    observeAttributes(this);
  }

  render() {
    const name = this.getAttribute("data-name");
    const valueAttr = this.getAttribute("data-value");
    const value = this.getAttribute(`data-${valueAttr}`);
    this.innerText = `${name}: ${value}`;
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
    customElements.define("gen-label", GenLabel, { extends: "label" });
  }
}

export default View;
