"use strict";
class Planet2 {
    constructor(n, a, g) {
        this.planetName = n;
        this.age = a;
        this.gases = g;
    }
}
let planet1 = new Planet2('Jupiter', 60000000, ['Helium', 'Methane']);
console.log(planet1);
planet1 = {
    planetName: 'Earth',
    age: 4000000000,
    gases: ['Oxygen', 'Hydrogen', 'Nitrogen'],
};
console.log(planet1);
