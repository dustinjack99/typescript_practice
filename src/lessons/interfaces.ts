//interface as a function type
interface listGases {
  (gases: string[]): void;
}

//interface extending another interface
interface Gases extends PlanetInt {
  readonly gases: string[];
}

interface PlanetInt {
  planetName: string;
  age: number;
  // renderPlanet(metals: object, gases: object): void;
}

class Planet2 implements PlanetInt, Gases {
  planetName: string;
  age: number;
  gases: string[];

  constructor(n: string, a: number, g: string[]) {
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
  // renderPlanet(metals: object, gases: object) {
  //     console.log(metals.list + gases.list )
  // }
};
console.log(planet1);
