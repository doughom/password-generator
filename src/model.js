const state = {
  length: 16,
  copied: false,
  lower: true,
  upper: true,
  digit: true,
};

const changeHandler = {
  set(obj, prop, value) {
    return Reflect.set(obj, prop, value);
  },
};

const model = new Proxy(state, changeHandler);

export default model;
