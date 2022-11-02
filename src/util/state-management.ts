import {Project, ProjectStatus} from "../models/project-model";

//? HERE WE CREATE A CUSTOM TYPE OF LISTENER FOR ALL LISTENERS WILL HAVE ALWAYS THE SAME ARGUMENTS
//? AND RETURN TYPE

export type Listener<T> = (items: T[]) => void;

export class State<T> {
  protected listeners: Listener<T>[] = [];

  //! THE LISTENER FUNCTION AT THE END IS JUST A WAY TO MAKE THE CODE "LISTEN" WHEN WE CHANGE
  //! SOMETHING RELEVANT AND WHAT TO DO WHEN TIS HAPPENS
  addListener(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn);
  }
}

//? THIS CLASS WILL HELP US TO MANAGE THE STATE AND DO SOMETHING WHENEVER SOMETHING CHANGES IN THE
//? WEB PAGE
export class ProjectState extends State<Project> {
  //? HERE WE CREATE THE INITIAL STATES OF THE CLASS WICH WILL BE EMPTY AT THE START

  private projects: Project[] = [];

  private static instance: ProjectState;

  private constructor() {
    super();
  }

  //? HERE WE CHECK IF THIS INSTANCE EXISTS, IF NOT IT CREATES A NEW INSTANCE, THIS IS A STATIC
  //? METHOD BECAUSE ITS INVOKED EVERY TIME AN INSTANCE IS CREATED... THIS HELP US NOT TO
  //? DUPLICATE THE STATE

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjectState();
    return this.instance;
  }

  //? THIS METHOD NEDDS TO BE CALLED WHENEVER WE CREATE A NEW PROYECT AN WILL MODIFY THE STATE
  //? OF "PROJECTS" EACH TIME WE CLICK THE SUMBIT BUTTON

  addProject(title: string, description: string, numOfPeople: number) {
    const newProject = new Project(
      Math.random().toString(),
      title,
      description,
      numOfPeople,
      ProjectStatus.Active
    );
    this.projects.push(newProject);

    //! IN THIS CASE THE LISTENER FUNCTION CREATES A COPY OF 'PROYECTS' SO THE ORIGINAL STATE
    //! KEEPS UNCHANGED

    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice());
    }
  }

  moveProject(projectId: string, newStatus: ProjectStatus) {
    const project = this.projects.find((prj) => prj.id === projectId);

    if (project && project.status !== newStatus) {
      project.status = newStatus;
      this.updateListeners();
    }
  }

  private updateListeners() {
    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice());
    }
  }
}

//? HERE WE CREATE A GLOBAL STATE THAT CAN BE USED ALL OVER THE CODE TO VERIFY THE PROJECTS
export const projectState = ProjectState.getInstance();
