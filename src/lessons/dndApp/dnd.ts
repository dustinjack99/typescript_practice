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

const projInp = new ProjectInp();
const activeList = new ProjList('active');
const finishedList = new ProjList('finished');
