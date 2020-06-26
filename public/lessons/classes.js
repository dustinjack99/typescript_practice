"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Planet = (function () {
    function Planet(name) {
        this.name = name;
        this.gases = [];
    }
    Planet.prototype.getGases = function () {
        console.log(this.gases.length);
        console.log(this.gases);
    };
    return Planet;
}());
var rockPlanet = (function (_super) {
    __extends(rockPlanet, _super);
    function rockPlanet(name, metals) {
        var _this = _super.call(this, name) || this;
        _this.metals = metals;
        return _this;
    }
    rockPlanet.prototype.describe = function () {
        console.log('Planet: ' + this.name, 'Metals: ' + this.metals);
    };
    rockPlanet.prototype.listMetals = function () {
        console.log(this.metals);
    };
    return rockPlanet;
}(Planet));
var earth = new rockPlanet('Earth', ['Gold', 'Silver']);
var mars = new rockPlanet('Mars', ['Iron', 'Copper']);
mars.listMetals();
earth.describe();
