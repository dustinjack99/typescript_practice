//project type
export enum ProjStatus {
  Active,
  Finished,
}
export class Project {
  constructor(
    public id: string,
    public title: string,
    public desc: string,
    public ppl: number,
    public status: ProjStatus
  ) {}
}
