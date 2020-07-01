//autobind
export function autobind(_1: any, _2: string, desc: PropertyDescriptor) {
  const oMethod = desc.value;
  const adjDesc: PropertyDescriptor = {
    configurable: true,
    get() {
      const boundFn = oMethod.bind(this);
      return boundFn;
    },
  };
  return adjDesc;
}
