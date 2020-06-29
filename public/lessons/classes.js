"use strict";
class Planet {
    constructor(name) {
        this.name = name;
        this.gases = [];
    }
    getGases() {
        console.log(this.gases.length);
        console.log(this.gases);
    }
}
class rockPlanet extends Planet {
    constructor(name, metals) {
        super(name);
        this.metals = metals;
    }
    describe() {
        console.log('Planet: ' + this.name, 'Metals: ' + this.metals);
    }
    listMetals() {
        console.log(this.metals);
    }
}
const earth = new rockPlanet('Earth', ['Gold', 'Silver']);
const mars = new rockPlanet('Mars', ['Iron', 'Copper']);
mars.listMetals();
earth.describe();
