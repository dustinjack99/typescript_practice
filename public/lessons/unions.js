"use strict";
var Role;
(function (Role) {
    Role[Role["ADMIN"] = 0] = "ADMIN";
    Role[Role["READ_ONLY"] = 1] = "READ_ONLY";
    Role[Role["AUTHOR"] = 2] = "AUTHOR";
})(Role || (Role = {}));
const person = {
    name: 'Dustin',
    age: 30,
    hobbies: ['coding', 'dwarf fortress'],
    role: Role.ADMIN,
};
let favActs;
if (person.role === Role.AUTHOR) {
}
