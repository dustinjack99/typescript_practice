"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ProjStatus;
(function (ProjStatus) {
    ProjStatus[ProjStatus["Active"] = 0] = "Active";
    ProjStatus[ProjStatus["Finished"] = 1] = "Finished";
})(ProjStatus || (ProjStatus = {}));
class Project {
    constructor(id, title, desc, ppl, status) {
        this.id = id;
        this.title = title;
        this.desc = desc;
        this.ppl = ppl;
        this.status = status;
    }
}
class ProjState {
    constructor() {
        this.listeners = [];
        this.projects = [];
    }
    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new ProjState();
        return this.instance;
    }
    addListener(listenFn) {
        this.listeners.push(listenFn);
    }
    addProject(title, desc, numPpl) {
        const newProj = new Project(Math.random().toString(), title, desc, numPpl, ProjStatus.Active);
        this.projects.push(newProj);
        for (const listenFn of this.listeners) {
            listenFn(this.projects.slice());
        }
    }
}
const projState = ProjState.getInstance();
function valid(validateInp) {
    let isValid = true;
    if (validateInp.required) {
        isValid = isValid && validateInp.value.toString().trim().length !== 0;
    }
    if (validateInp.minLength != null && typeof validateInp.value === 'string') {
        isValid = isValid && validateInp.value.length > validateInp.minLength;
    }
    if (validateInp.maxLength != null && typeof validateInp.value === 'string') {
        isValid = isValid && validateInp.value.length < validateInp.maxLength;
    }
    if (validateInp.min != null && typeof validateInp.value === 'number') {
        isValid = isValid && validateInp.value > validateInp.min;
    }
    if (validateInp.max != null && typeof validateInp.value === 'number') {
        isValid = isValid && validateInp.value < validateInp.max;
    }
    return isValid;
}
function autobind(_1, _2, desc) {
    const oMethod = desc.value;
    const adjDesc = {
        configurable: true,
        get() {
            const boundFn = oMethod.bind(this);
            return boundFn;
        },
    };
    return adjDesc;
}
class ProjList {
    constructor(type) {
        this.type = type;
        this.templateEl = document.getElementById('project-list');
        this.hostEl = document.getElementById('app');
        this.assignedProjs = [];
        const importedNode = document.importNode(this.templateEl.content, true);
        this.element = importedNode.firstElementChild;
        this.element.id = `${this.type}-projects`;
        ProjState.addListener((projects) => {
            this.assignedProjs = projects;
            this.renderProjs();
        });
        this.attach();
        this.renderContent();
    }
    renderProjs() {
        const listEl = document.getElementById(`${this.type}-projects-list`);
        for (const prjItrm of this.assignedProjs) {
            const listItem = document.createElement('li');
            listItem.textContent = prjItrm.title;
            listEl.appendChild(listItem);
        }
    }
    renderContent() {
        const listId = `${this.type}-projects-list`;
        this.element.querySelector('ul').id = listId;
        this.element.querySelector('h2').textContent =
            this.type.toUpperCase() + ' projects';
    }
    attach() {
        this.hostEl.insertAdjacentElement('beforeend', this.element);
    }
}
class ProjectInp {
    constructor() {
        this.templateEl = document.getElementById('project-input');
        this.hostEl = document.getElementById('app');
        const importedNode = document.importNode(this.templateEl.content, true);
        this.element = importedNode.firstElementChild;
        this.element.id = 'user-input';
        this.titleInpEl = this.element.querySelector('#title');
        this.pplInpEl = this.element.querySelector('#people');
        this.descInpEl = this.element.querySelector('#description');
        this.configure();
        this.attach();
    }
    gatherUserInp() {
        const title = this.titleInpEl.value;
        const desc = this.descInpEl.value;
        const ppl = this.pplInpEl.value;
        const titleVal = {
            value: title,
            required: true,
        };
        const descVal = {
            value: desc,
            required: true,
            minLength: 5,
        };
        const pplVal = {
            value: ppl,
            required: true,
            min: 1,
            max: 5,
        };
        if (valid(titleVal) || valid(descVal) || valid(pplVal)) {
            throw new Error('invalid input');
        }
        else {
            return [title, desc, +ppl];
        }
    }
    clearInps() {
        this.titleInpEl.value = '';
        this.pplInpEl.value = '';
        this.descInpEl.value = '';
    }
    subHandle(event) {
        event.preventDefault();
        const userInp = this.gatherUserInp();
        if (Array.isArray(userInp)) {
            const [title, desc, ppl] = userInp;
            ProjState.addProject(title, desc, ppl);
            this.clearInps();
        }
    }
    configure() {
        this.element.addEventListener('submit', this.subHandle);
    }
    attach() {
        this.hostEl.insertAdjacentElement('afterbegin', this.element);
    }
}
__decorate([
    autobind
], ProjectInp.prototype, "subHandle", null);
const projInp = new ProjectInp();
const activeList = new ProjList('active');
const finishedList = new ProjList('finished');
