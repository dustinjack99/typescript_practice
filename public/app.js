"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
function Logger(logString) {
    return function (constructor) {
        console.log(logString);
        console.log(constructor);
    };
}
function WithTemplate(template, hookId) {
    return function (_) {
        const hook = document.getElementById(hookId);
        if (hook) {
            hook.innerHTML = template;
        }
    };
}
let Person = class Person {
    constructor() {
        this.name = 'dustin';
    }
};
Person = __decorate([
    WithTemplate('', 'app')
], Person);
function Log(target, propertyName) {
    console.log('prop decor');
    console.log(propertyName, target);
}
function Log2(target, name, desc) {
    console.log('accessor');
    console.log(target);
    console.log(name);
    console.log(desc);
}
function Log3(target, name, desc) {
    console.log('method');
    console.log(target);
    console.log(name);
    console.log(desc);
}
function Log4(target, name, position) {
    console.log('parameter');
    console.log(target);
    console.log(name);
    console.log(position);
}
class Product {
    constructor(t, p) {
        this.title = t;
        this._price = p;
    }
    set price(val) {
        if (val > 0) {
            this._price = val;
        }
        else {
            throw new Error('invalid price');
        }
    }
    getPriceWithTax(tax) {
        return this._price * (1 + tax);
    }
}
__decorate([
    Log
], Product.prototype, "title", void 0);
__decorate([
    Log2
], Product.prototype, "price", null);
__decorate([
    Log3,
    __param(0, Log4)
], Product.prototype, "getPriceWithTax", null);
