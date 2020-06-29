// can also be used for interfaces
//Intersection types, that is
type Admin = {
  name: string;
  privileges: string[];
};

type Employee = {
  name: string;
  startDate: Date;
};

type ElevatedEmployee = Admin & Employee;

const e1: ElevatedEmployee = {
  name: 'Max',
  privileges: ['create-server'],
  startDate: new Date(),
};

type Combinable2 = string | number;
type Numeric = number | boolean;
//This will only have type 'number' assosciated with it.
//It will only build the intersection of types.
type Universal = Combinable2 & Numeric;

//function overloads to define specific input / output;
function add2(n1: number, b: number): number;
function add2(n1: string, b: string): string;

//TYPE GUARDS
function add2(n1: Combinable, b: Combinable) {
  if (typeof n1 === 'string' || typeof b === 'string') {
    return n1.toString() + b.toString();
  }

  return n1 + b;
}

type UnknownEmployee = Employee | Admin;

function printEmp(emp: UnknownEmployee) {
  console.log('name: ' + emp);
  //Typeguard of:
  //How to check for possible properties in an object;
  if ('privileges' in emp) {
    console.log('privileges: ' + emp.privileges);
  }
}

class Car {
  drive() {
    console.log('Driving');
  }
}

class Truck {
  drive() {
    console.log('Driving Truck');
  }

  loadCargo(amount: number) {
    console.log('Loading cargo: ' + amount);
  }
}

type Vehicle = Car | Truck;

const v1 = new Car();
const v2 = new Truck();

function useVehicle(vehicle: Vehicle) {
  vehicle.drive();
  //Typeguard check for instances where the
  //type of instance is unknown.
  //This is actually available in vanilla JS!
  if (vehicle instanceof Truck) {
    vehicle.loadCargo(100);
  }
}

//Descriminated Union
//Available at object types

interface Bird {
  type: 'bird';
  flyingSpeed: number;
}

interface Horse {
  type: 'horse';
  runSpeed: number;
}

type Animal = Bird | Horse;

//How to typeguard like-defined interfaces
//with a switch function
const moveAnimal = (animal: Animal) => {
  let speed;
  switch (animal.type) {
    case 'bird':
      speed = animal.flyingSpeed;
      break;
    case 'horse':
      speed = animal.runSpeed;
  }

  console.log('Moving at speed: ' + speed);
};

//Typecasting

//non-React, will clash with JSX
const userInputElement = <HTMLInputElement>(
  document.getElementById('user-input')
);

//Will mesh well with React
const InpElement = document.querySelector('user-inp') as HTMLInputElement;

//How to typeguard typecasting
if (InpElement) {
  (InpElement as HTMLInputElement).value = 'GENERAL KENOBI';
}
InpElement.value = 'hallo thar';

//index propterties
//Useful for when you know the values, but not how many
// or what the keys will be called;
interface ErrorContainer {
  //property as string, value as string
  //gives flexability for defining objects
  //based on the container
  [prop: string]: string;
}

const errorBag: ErrorContainer = {
  email: 'not valid email',
  username: 'must start with Cap Character',
};

//Optional chaining
const fetchData = {
  id: 'u1',
  name: 'Dustin',
  // job: {title: 'codeNinja'}
};
//this checks to see if data exists
// console.log(fetchData?.job?.title);

//Nullish Coalescing
const userInp = null;
const StoredData = userInp ?? 'Default';
