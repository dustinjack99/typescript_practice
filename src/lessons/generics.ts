//THIS TRANSLATES TO C# SO PAY ATTENTION DUMMY

//Generic type that can be flexible on what its defined as
// const names: Array<string> = []; //same as string[];
//will know to access array methods
// names[0].split(' ');

//generic of a promise that returns string;
const promise: Promise<string> = new Promise(resolve => {
  setTimeout(() => {
    resolve('done!');
  }, 2000);
});

promise.then(data => {
  //will know what data the promise can work with,
  //like calling string methods on a string.
  data.split(' ');
});

//Can build your own Generic Types!

//infers the intersection of T && U
//the 'extends' determines all data will be constrained with object constraints
function merge<T extends object, U extends object>(objA: T, objB: U) {
  return Object.assign(objA, objB);
}

//you can see the number 30 is constrained and will
//throw an error in the compiler
// const mergeObj = merge({name: 'dustin'}, 30);
// console.log(mergeObj.name)
// console.log(mergeObj.age)

interface Lengthy {
  length: number;
}

//it helps to be unspecific, it makes the function adaptable
function countAndPrint<T extends Lengthy>(ele: T): [T, string] {
  let descText = 'got no val';
  if (ele.length === 0) {
    descText = 'got one element';
  } else if (ele.length > 1) {
    descText = 'got ' + ele.length + ' elements';
  }

  return [ele, descText];
}

console.log(countAndPrint('Hello there'));

//keyof constraint
//insures T will be object, and U will have a key on that object
function extractConvert<T extends object, U extends keyof T>(obj: T, key: U) {
  return obj[key];
}

//Generic Classes
//again, the flexibility is the biggest way to
//insure DRY code. can used to define Store as
//stores of multiple types.
class Store<T extends string | number | boolean> {
  private data: T[] = [];

  //keep in mind methods inside objects
  //can also have generic types
  // ..here.....
  addItem(item: T) {
    this.data.push(item);
  }

  removeItem(item: T) {
    this.data.splice(this.data.indexOf(item), 1);
  }

  getItems() {
    return [...this.data];
  }
}

//used to name number AND string storage
//flexible with still being strongly typed
const textStore = new Store<string>();
const numStore = new Store<number>();

//Be aware that this will fail because object is not
//a primitive datatype. You would need to work with the
//same object in memory, not the different one created
//if more than one is entered. WATCH OUT FOR THIS
// const objStorage = new Store<object>();

//Generic Utility Types

interface goal {
  title: string;
  desc: string;
  completed: Date;
}

//partial utility type
function createGoal(title: string, desc: string, date: Date): goal {
  let coarseGoal: Partial<goal> = {};
  coarseGoal.title = title;
  coarseGoal.desc = desc;
  coarseGoal.completed = date;

  return coarseGoal as goal;
}

const names: Readonly<string[]> = ['dustin', 'ben'];
// names.push('tim');
