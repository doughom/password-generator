class Model {
  proxy = null;

  #length = 16;

  get length() {
    return this.#length;
  }
  set length(value) {
    this.#length = value;
    const password = generatePassword();
    this.#set("password", password);
  }

  #set(prop, value) {
    if (this.proxy === null) {
      this[prop] = value;
    } else {
      this.proxy[prop] = value;
    }
  }
}

function generatePassword() {
  return "abc";
}

export default Model;
