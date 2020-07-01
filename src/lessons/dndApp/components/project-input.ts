import { Component } from './base-components.js';
import { valid, Validate } from '../util/validtion.js';
import { autobind } from '../decorators/autobind.js';
import { projState } from '../state/project-state.js';

export class ProjectInp extends Component<HTMLDivElement, HTMLFormElement> {
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
