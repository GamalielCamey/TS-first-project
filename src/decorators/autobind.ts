//? WE NEED TO CREATE A DECORATOR FOR THE BINDING OF THE THIS KEYWORD
export function Autobind(
  //? USING THE _ WE TELL TYPESCRIPT TO IGNORE UNUSED VARIABLES
  _target: any,
  _methodName: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      //?? HERE WE BIND THE THIS KEYWORD TO THE METHOD THAT USES THE DECORATOR
      const boundFn = originalMethod.bind(this);
      return boundFn;
    },
  };
  return adjDescriptor;
}
