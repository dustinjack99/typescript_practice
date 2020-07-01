// dnd interfaces
interface Draggable {
  dragStart(event: DragEvent): void;
  dragEnd(event: DragEvent): void;
}

interface DragTarget {
  dragOverHandler(event: DragEvent): void;
  dropHandler(event: DragEvent): void;
  dragLeaveHandler(event: DragEvent): void;
}

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

type Listener<T> = (items: T[]) => void;

class State<T> {
  protected listeners: Listener<T>[] = [];

  addListener(listenFn: Listener<T>) {
    this.listeners.push(listenFn);
  }
}
class ProjState extends State<Project> {
  private projects: Project[] = [];
  private static instance: ProjState;

  private constructor() {
    super();
  }

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjState();
    return this.instance;
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

// proj base class
abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  templateEl: HTMLTemplateElement;
  hostEl: T;
  element: U;

  constructor(
    templateId: string,
    hostElementId: string,
    insertAtStart: boolean,
    newElementId?: string
  ) {
    this.templateEl = document.getElementById(
      templateId
    )! as HTMLTemplateElement;
    this.hostEl = document.getElementById(hostElementId)! as T;

    const importedNode = document.importNode(this.templateEl.content, true);

    this.element = importedNode.firstElementChild as U;
    if (newElementId) {
      this.element.id = newElementId;
    }

    this.attach(insertAtStart);
  }

  private attach(insertAtBeginning: boolean) {
    this.hostEl.insertAdjacentElement(
      insertAtBeginning ? 'afterbegin' : 'beforeend',
      this.element
    );
  }

  abstract configure(): void;
  abstract renderContent(): void;
}

//projItem class
class ProjItem extends Component<HTMLUListElement, HTMLLIElement>
  implements Draggable {
  private project: Project;

  get persons() {
    if (this.project.ppl === 1) {
      return '1 person';
    } else {
      return `${this.project.ppl} persons`;
    }
  }

  constructor(hostId: string, project: Project) {
    super('single-project', hostId, false, project.id);
    this.project = project;

    this.configure();
    this.renderContent();
  }

  @autobind
  dragStart(event: DragEvent) {
    console.log(event);
  }

  @autobind
  dragEnd(event: DragEvent) {
    console.log('dragend');
  }

  configure() {
    this.element.addEventListener('dragstart', this.dragStart);
    this.element.addEventListener('dragend', this.dragEnd);
  }

  renderContent() {
    this.element.querySelector('h2')!.textContent = this.project.title;
    this.element.querySelector('h3')!.textContent = this.persons + ' assigned';
    this.element.querySelector('h4')!.textContent = this.project.desc;
  }
}

// projectList
class ProjList extends Component<HTMLDivElement, HTMLElement> {
  assignedProjs: Project[];

  constructor(private type: 'active' | 'finished') {
    super('project-list', 'app', false, `${type}-projects`);
    this.assignedProjs = [];

    this.configure();
    this.renderContent();
  }

  configure() {
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
  }

  renderContent() {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector('ul')!.id = listId;
    this.element.querySelector('h2')!.textContent =
      this.type.toUpperCase() + ' projects';
  }

  private renderProjs() {
    const listEl = document.getElementById(
      `${this.type}-projects-list`
    )! as HTMLUListElement;
    listEl.innerHTML = '';
    for (const prjItrm of this.assignedProjs) {
      new ProjItem(this.element.querySelector('ul')!.id, prjItrm);
    }
  }
}

//projectinput class
class ProjectInp extends Component<HTMLDivElement, HTMLFormElement> {
  titleInpEl: HTMLInputElement;
  descInpEl: HTMLInputElement;
  pplInpEl: HTMLInputElement;

  constructor() {
    super('project-input', 'app', true, 'user-input');
    this.titleInpEl = this.element.querySelector('#title') as HTMLInputElement;
    this.pplInpEl = this.element.querySelector('#people') as HTMLInputElement;
    this.descInpEl = this.element.querySelector(
      '#description'
    ) as HTMLInputElement;
    this.configure();
  }

  configure() {
    this.element.addEventListener('submit', this.subHandle);
  }

  renderContent() {}

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
}

const projInp = new ProjectInp();
const activeList = new ProjList('active');
const finishedList = new ProjList('finished');
