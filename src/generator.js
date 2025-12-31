class CustomElement {
  elem;

  constructor(id) {
    this.elem = document.getElementById(id);
  }

  update() {}
  reset() {}
}

class LengthSlider extends CustomElement {
  defaultValue = 15;
  label;

  constructor(id) {
    super(id);
    this.label = document.getElementById(`${id}-label`);
    this.elem.value = this.defaultValue;
    this.update();
  }

  update() {
    this.label.innerHTML = `Characters: ${this.elem.value}`;
  }
}

class CopyButton extends CustomElement {
  update() {
    const password = document.getElementById("password").innerHTML;
    navigator.clipboard.writeText(password);
    this.elem.innerHTML = "Copied";
    this.elem.classList.add("btn-success");
  }

  reset() {
    this.elem.innerHTML = "Copy";
    this.elem.classList.remove("btn-success");
  }
}

class GenerateButton extends CustomElement {
  update() {
    const chars = getCharacters("DLU");
    const numChars = document.getElementById("length");
    const password = generatePassword(numChars.value, chars);
    document.getElementById("password").innerHTML = password;
  }
}

/**
 * Create a random password from the specified characters.
 * @param {number} length
 * @param {string} chars
 * @returns {string}
 */
function generatePassword(length, chars) {
  let randomInts = new Uint32Array(length);
  window.crypto.getRandomValues(randomInts);
  randomInts = randomInts.map((i) => i % chars.length);

  let password = "";

  randomInts.forEach((i) => {
    password = password.concat(chars.charAt(i));
  });

  return password;
}

/**
 * Return the characters from the specified character set(s)
 *
 * Valid sets: (D)igits, (L)ower, and (U)pper
 * @param {string} charSets D, L, and/or U
 * @returns {string}
 */
function getCharacters(charSets) {
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const digit = "0123456789";

  let chars = "";

  if (charSets.includes("D")) {
    chars = chars.concat(digit);
  }
  if (charSets.includes("L")) {
    chars = chars.concat(lower);
  }
  if (charSets.includes("U")) {
    chars = chars.concat(upper);
  }

  return chars;
}

const copy = new CopyButton("copy");
copy.elem.addEventListener("click", () => {
  copy.update();
});

const slider = new LengthSlider("length");
slider.elem.addEventListener("input", () => {
  slider.update();
  generate.elem.click();
});

const generate = new GenerateButton("generate");
generate.elem.addEventListener("click", () => {
  generate.update();
  copy.reset();
});

generate.elem.click();
