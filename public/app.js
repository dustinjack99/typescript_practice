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
class State {
    constructor() {
        this.listeners = [];
    }
    addListener(listenFn) {
        this.listeners.push(listenFn);
    }
}
class ProjState extends State {
    constructor() {
        super();
        this.projects = [];
    }
    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new ProjState();
        return this.instance;
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
function valid(validatableInput) {
    let isValid = true;
    if (validatableInput.required) {
        isValid = isValid && validatableInput.value.toString().trim().length !== 0;
    }
    if (validatableInput.minLength != null &&
        typeof validatableInput.value === 'string') {
        isValid =
            isValid && validatableInput.value.length >= validatableInput.minLength;
    }
    if (validatableInput.maxLength != null &&
        typeof validatableInput.value === 'string') {
        isValid =
            isValid && validatableInput.value.length <= validatableInput.maxLength;
    }
    if (validatableInput.min != null &&
        typeof validatableInput.value === 'number') {
        isValid = isValid && validatableInput.value >= validatableInput.min;
    }
    if (validatableInput.max != null &&
        typeof validatableInput.value === 'number') {
        isValid = isValid && validatableInput.value <= validatableInput.max;
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
class Component {
    constructor(templateId, hostElementId, insertAtStart, newElementId) {
        this.templateEl = document.getElementById(templateId);
        this.hostEl = document.getElementById(hostElementId);
        const importedNode = document.importNode(this.templateEl.content, true);
        this.element = importedNode.firstElementChild;
        if (newElementId) {
            this.element.id = newElementId;
        }
        this.attach(insertAtStart);
    }
    attach(insertAtBeginning) {
        this.hostEl.insertAdjacentElement(insertAtBeginning ? 'afterbegin' : 'beforeend', this.element);
    }
}
class ProjList extends Component {
    constructor(type) {
        super('project-list', 'app', false, `${type}-projects`);
        this.type = type;
        this.assignedProjs = [];
        this.configure();
        this.renderContent();
    }
    configure() {
        projState.addListener((projects) => {
            const relevantProjs = projects.filter(prj => {
                if (this.type === 'active') {
                    return prj.status === ProjStatus.Active;
                }
                return prj.status === ProjStatus.Finished;
            });
            this.assignedProjs = relevantProjs;
            this.renderProjs();
        });
    }
    renderContent() {
        const listId = `${this.type}-projects-list`;
        this.element.querySelector('ul').id = listId;
        this.element.querySelector('h2').textContent =
            this.type.toUpperCase() + ' projects';
    }
    renderProjs() {
        const listEl = document.getElementById(`${this.type}-projects-list`);
        listEl.innerHTML = '';
        for (const prjItrm of this.assignedProjs) {
            const listItem = document.createElement('li');
            listItem.textContent = prjItrm.title;
            listEl.appendChild(listItem);
        }
    }
}
class ProjectInp extends Component {
    constructor() {
        super('project-input', 'app', true, 'user-input');
        this.titleInpEl = this.element.querySelector('#title');
        this.pplInpEl = this.element.querySelector('#people');
        this.descInpEl = this.element.querySelector('#description');
        this.configure();
    }
    configure() {
        this.element.addEventListener('submit', this.subHandle);
    }
    renderContent() { }
    gatherUserInp() {
        const usertitle = this.titleInpEl.value;
        const userdesc = this.descInpEl.value;
        const userppl = this.pplInpEl.value;
        const titleVal = {
            value: usertitle,
            required: true,
        };
        const descVal = {
            value: userdesc,
            required: true,
            minLength: 5,
        };
        const pplVal = {
            value: userppl,
            required: true,
            min: 1,
            max: 5,
        };
        if (!valid(titleVal) || !valid(descVal) || !valid(pplVal)) {
            throw new Error('invalid input');
        }
        else {
            return [usertitle, userdesc, +userppl];
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
            projState.addProject(title, desc, ppl);
            this.clearInps();
        }
    }
}
__decorate([
    autobind
], ProjectInp.prototype, "subHandle", null);
const projInp = new ProjectInp();
const activeList = new ProjList('active');
const finishedList = new ProjList('finished');
