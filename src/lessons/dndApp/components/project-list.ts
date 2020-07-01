import { DragTarget } from '../models/drag-drop.js';
import { Project, ProjStatus } from '../models/projects.js';
import { Component } from './base-components.js';
import { autobind } from '../decorators/autobind.js';
import { projState } from '../state/project-state.js';
import { ProjItem } from './project-item.js';

// projectList
export class ProjList extends Component<HTMLDivElement, HTMLElement>
  implements DragTarget {
  assignedProjs: Project[];

  constructor(private type: 'active' | 'finished') {
    super('project-list', 'app', false, `${type}-projects`);
    this.assignedProjs = [];

    this.configure();
    this.renderContent();
  }

  @autobind
  dragLeaveHandler(_: DragEvent): void {
    const listEl = this.element.querySelector('ul')!;
    listEl.classList.remove('droppable');
  }

  @autobind
  dragOverHandler(event: DragEvent): void {
    if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
      event.preventDefault();
      const listEl = this.element.querySelector('ul')!;
      listEl.classList.add('droppable');
    }
  }

  @autobind
  dropHandler(event: DragEvent): void {
    const prjId = event.dataTransfer!.getData('text/plain');
    projState.movePoject(
      prjId,
      this.type === 'active' ? ProjStatus.Active : ProjStatus.Finished
    );
  }

  configure() {
    this.element.addEventListener('dragover', this.dragOverHandler);
    this.element.addEventListener('dragleave', this.dragLeaveHandler);
    this.element.addEventListener('drop', this.dropHandler);
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
