import { ProjStatus, Project } from '../models/projects.js';

//state management

export type Listener<T> = (items: T[]) => void;

export class State<T> {
  protected listeners: Listener<T>[] = [];

  addListener(listenFn: Listener<T>) {
    this.listeners.push(listenFn);
  }
}
export class ProjState extends State<Project> {
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
    this.updateListeners();
  }

  movePoject(projectId: string, newStatus: ProjStatus) {
    const project = this.projects.find(prj => prj.id === projectId);
    if (project && project.status !== newStatus) {
      project.status = newStatus;
      this.updateListeners();
    }
  }

  private updateListeners() {
    for (const listenFn of this.listeners) {
      listenFn(this.projects.slice());
    }
  }
}

export const projState = ProjState.getInstance();
