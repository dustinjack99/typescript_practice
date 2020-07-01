//project type
enum ProjStatus {
  Active,
  Finished,
}
class Project {
  constructor(
    public id: string,
    public title: string,
    public desc: string,
    public ppl: number,
    public status: ProjStatus
  ) {}
}

//state management

type Listener = (items: Project[]) => void;
class ProjState {
  private listeners: Listener[] = [];
  private projects: Project[] = [];
  private static instance: ProjState;

  private constructor() {}

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjState();
    return this.instance;
  }

  addListener(listenFn: Listener) {
    this.listeners.push(listenFn);
  }

  addProject(title: string, desc: string, numPpl: number) {
    const newProj = new Project(
      Math.random().toString(),
      title,
      desc,
      numPpl,
      ProjStatus.Active
    );
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

function valid(validatableInput: Validate) {
  let isValid = true;
  if (validatableInput.required) {
    isValid = isValid && validatableInput.value.toString().trim().length !== 0;
  }
  if (
    validatableInput.minLength != null &&
    typeof validatableInput.value === 'string'
  ) {
    isValid =
      isValid && validatableInput.value.length >= validatableInput.minLength;
  }
  if (
    validatableInput.maxLength != null &&
    typeof validatableInput.value === 'string'
  ) {
    isValid =
      isValid && validatableInput.value.length <= validatableInput.maxLength;
  }
  if (
    validatableInput.min != null &&
    typeof validatableInput.value === 'number'
  ) {
    isValid = isValid && validatableInput.value >= validatableInput.min;
  }
  if (
    validatableInput.max != null &&
    typeof validatableInput.value === 'number'
  ) {
    isValid = isValid && validatableInput.value <= validatableInput.max;
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
  assignedProjs: Project[];

  constructor(private type: 'active' | 'finished') {
    this.templateEl = document.getElementById(
      'project-list'
    )! as HTMLTemplateElement;
    this.hostEl = document.getElementById('app')! as HTMLDivElement;
    this.assignedProjs = [];

    const importedNode = document.importNode(this.templateEl.content, true);

    this.element = importedNode.firstElementChild as HTMLElement;
    this.element.id = `${this.type}-projects`;

    projState.addListener((projects: Project[]) => {
      const relevantProjs = projects.filter(prj => {
        if (this.type === 'active') {
          return prj.status === ProjStatus.Active;
        }
        return prj.status === ProjStatus.Finished;
      });
      this.assignedProjs = relevantProjs;
      this.renderProjs();
    });

    this.attach();
    this.renderContent();
  }

  private renderProjs() {
    const listEl = document.getElementById(
      `${this.type}-projects-list`
    )! as HTMLUListElement;
    listEl.innerHTML = '';
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
    const usertitle = this.titleInpEl.value;
    const userdesc = this.descInpEl.value;
    const userppl = this.pplInpEl.value;

    const titleVal: Validate = {
      value: usertitle,
      required: true,
    };
    const descVal: Validate = {
      value: userdesc,
      required: true,
      minLength: 5,
    };
    const pplVal: Validate = {
      value: userppl,
      required: true,
      min: 1,
      max: 5,
    };

    if (!valid(titleVal) || !valid(descVal) || !valid(pplVal)) {
      throw new Error('invalid input');
    } else {
      return [usertitle, userdesc, +userppl];
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
      projState.addProject(title, desc, ppl);
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
