"use strict";
var Planet = (function () {
    function Planet(n) {
        this.name = n;
    }
    return Planet;
}());
var earth = new Planet('Earth');
console.log(earth);
