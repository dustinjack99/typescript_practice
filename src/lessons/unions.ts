// const ADMIN = 0;
// const READ_ONLY = 1;
// const AUTHOR = 2;

//FANTASTIC for human readable variabls that need to be mapped and tracked with a certain value;
enum Role {
  ADMIN,
  READ_ONLY,
  AUTHOR,
}

const person = {
  name: 'Dustin',
  age: 30,
  hobbies: ['coding', 'dwarf fortress'],
  role: Role.ADMIN,
};

// person.role.push('admin');
// person.role[1] = 10;

let favActs: string[];

// console.log(person.name);

//way a for-loop can map something in an object.
// for (const hobby of person.hobbies) {
// console.log(hobby.toUpperCase());
// }

if (person.role === Role.AUTHOR) {
  // console.log('is author');
}
