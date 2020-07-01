import { Draggable } from '../models/drag-drop.js';
import { Project } from '../models/projects.js';
import { Component } from './base-components.js';
import { autobind } from '../decorators/autobind.js';
//projItem class
export class ProjItem extends Component<HTMLUListElement, HTMLLIElement>
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
    event.dataTransfer!.setData('text/plain', this.project.id);
    event.dataTransfer!.effectAllowed = 'move';
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
