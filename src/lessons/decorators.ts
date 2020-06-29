// MUST ENABLE IN TSCONFIG.JSON,
// change target to es6, and enable experimental decorators

//Fun Fact: angular uses decorators to render lots of stuff
//Decorators are functions you can use to write tools for
//other developers. Use this to write libraries :) :) :)
function Logger(logString: string) {
  return function (constructor: Function) {
    console.log(logString);
    console.log(constructor);
  };
}

function WithTemplate(template: string, hookId: string) {
  return function (_: Function) {
    const hook = document.getElementById(hookId);
    if (hook) {
      hook.innerHTML = template;
    }
  };
}

//must be pointed at above whatever you want it to
//point to
@WithTemplate('', 'app')
class Person {
  name = 'dustin';
}

//logger for property
function Log(target: any, propertyName: string | Symbol) {
  console.log('prop decor');
  console.log(propertyName, target);
}

//logger for accessor
function Log2(target: any, name: string, desc: PropertyDescriptor) {
  console.log('accessor');
  console.log(target);
  console.log(name);
  console.log(desc);
}

//logger for method
function Log3(target: any, name: string | Symbol, desc: PropertyDescriptor) {
  console.log('method');
  console.log(target);
  console.log(name);
  console.log(desc);
}

//logger for parameter
function Log4(target: any, name: string | Symbol, position: number) {
  console.log('parameter');
  console.log(target);
  console.log(name);
  console.log(position);
}
class Product {
  @Log
  title: string;
  private _price: number;

  @Log2
  set price(val: number) {
    if (val > 0) {
      this._price = val;
    } else {
      throw new Error('invalid price');
    }
  }

  constructor(t: string, p: number) {
    this.title = t;
    this._price = p;
  }

  @Log3
  getPriceWithTax(@Log4 tax: number) {
    return this._price * (1 + tax);
  }
}

//loggers run no matter if the classes were instantiated.
// they run when you define the class, not at runtime.
// allows you to do more setup work.
