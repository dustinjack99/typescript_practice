//state management

class ProjState {
  private listeners: any[] = [];
  private projects: any[] = [];
  private static instance: ProjState;

  private constructor() {}

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjState();
    return this.instance;
  }

  addListener(listenFn: Function) {
    this.listeners.push(listenFn);
  }

  addProject(title: string, desc: string, numPpl: number) {
    const newProj = {
      id: Math.random().toString(),
      title: title,
      description: desc,
      peopel: numPpl,
    };
    this.projects.push(newProj);
    for (const listenFn of this.listeners) {
      listenFn(this.projects.slice());
    }
  }
}

const projState = ProjState.getInstance();

//validation
interface Validate {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

function valid(validateInp: Validate) {
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

//autobind
function autobind(_1: any, _2: string, desc: PropertyDescriptor) {
  const oMethod = desc.value;
  const adjDesc: PropertyDescriptor = {
    configurable: true,
    get() {
      const boundFn = oMethod.bind(this);
      return boundFn;
    },
  };
  return adjDesc;
}

// projectList
class ProjList {
  templateEl: HTMLTemplateElement;
  hostEl: HTMLDivElement;
  element: HTMLElement;
  assignedProjs: any[];

  constructor(private type: 'active' | 'finished') {
    this.templateEl = document.getElementById(
      'project-list'
    )! as HTMLTemplateElement;
    this.hostEl = document.getElementById('app')! as HTMLDivElement;
    this.assignedProjs = [];

    const importedNode = document.importNode(this.templateEl.content, true);

    this.element = importedNode.firstElementChild as HTMLElement;
    this.element.id = `${this.type}-projects`;

    ProjState.addListener((projects: any[]) => {
      this.assignedProjs = projects;
      this.renderProjs();
    });

    this.attach();
    this.renderContent();
  }

  private renderProjs() {
    const listEl = document.getElementById(
      `${this.type}-projects-list`
    )! as HTMLUListElement;
    for (const prjItrm of this.assignedProjs) {
      const listItem = document.createElement('li');
      listItem.textContent = prjItrm.title;
      listEl.appendChild(listItem);
    }
  }

  private renderContent() {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector('ul')!.id = listId;
    this.element.querySelector('h2')!.textContent =
      this.type.toUpperCase() + ' projects';
  }

  private attach() {
    this.hostEl.insertAdjacentElement('beforeend', this.element);
  }
}

//projectinput class
class ProjectInp {
  templateEl: HTMLTemplateElement;
  hostEl: HTMLDivElement;
  element: HTMLFormElement;
  titleInpEl: HTMLInputElement;
  descInpEl: HTMLInputElement;
  pplInpEl: HTMLInputElement;

  constructor() {
    this.templateEl = document.getElementById(
      'project-input'
    )! as HTMLTemplateElement;
    this.hostEl = document.getElementById('app')! as HTMLDivElement;

    const importedNode = document.importNode(this.templateEl.content, true);

    this.element = importedNode.firstElementChild as HTMLFormElement;
    this.element.id = 'user-input';

    this.titleInpEl = this.element.querySelector('#title') as HTMLInputElement;
    this.pplInpEl = this.element.querySelector('#people') as HTMLInputElement;
    this.descInpEl = this.element.querySelector(
      '#description'
    ) as HTMLInputElement;

    this.configure();
    this.attach();
  }

  private gatherUserInp(): [string, string, number] {
    const title = this.titleInpEl.value;
    const desc = this.descInpEl.value;
    const ppl = this.pplInpEl.value;

    const titleVal: Validate = {
      value: title,
      required: true,
    };
    const descVal: Validate = {
      value: desc,
      required: true,
      minLength: 5,
    };
    const pplVal: Validate = {
      value: ppl,
      required: true,
      min: 1,
      max: 5,
    };

    if (valid(titleVal) || valid(descVal) || valid(pplVal)) {
      throw new Error('invalid input');
    } else {
      return [title, desc, +ppl];
    }
  }

  private clearInps() {
    this.titleInpEl.value = '';
    this.pplInpEl.value = '';
    this.descInpEl.value = '';
  }

  @autobind
  private subHandle(event: Event) {
    event.preventDefault();

    const userInp = this.gatherUserInp();
    if (Array.isArray(userInp)) {
      const [title, desc, ppl] = userInp;
      ProjState.addProject(title, desc, ppl);
      this.clearInps();
    }
  }

  private configure() {
    this.element.addEventListener('submit', this.subHandle);
  }

  private attach() {
    this.hostEl.insertAdjacentElement('afterbegin', this.element);
  }
}

const projInp = new ProjectInp();
const activeList = new ProjList('active');
const finishedList = new ProjList('finished');
