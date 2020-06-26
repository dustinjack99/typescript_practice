//REVIEW STATIC METHODS - you kind of zoned out for that section
//Shame on you.

abstract class Planet {
  gases: string[] = [];

  constructor(protected name: string) {}

  //can insure that child classes will all have this method.
  //abstract classes cannot be instantiated, only their children.
  abstract describe(): void;

  getGases() {
    console.log(this.gases.length);
    console.log(this.gases);
  }
}

class rockPlanet extends Planet {
  constructor(name: string, private metals: string[]) {
    super(name);
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
