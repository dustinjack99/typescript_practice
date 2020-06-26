"use strict";
var Planet2 = (function () {
    function Planet2(n, a, g) {
        this.planetName = n;
        this.age = a;
        this.gases = g;
    }
    return Planet2;
}());
var planet1 = new Planet2('Jupiter', 60000000, ['Helium', 'Methane']);
console.log(planet1);
planet1 = {
    planetName: 'Earth',
    age: 4000000000,
    gases: ['Oxygen', 'Hydrogen', 'Nitrogen'],
};
console.log(planet1);
