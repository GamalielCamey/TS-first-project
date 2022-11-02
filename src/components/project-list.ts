import {DragTarget} from "../models/drag-drop";
import {Project, ProjectStatus} from "../models/project-model";
import {Component} from "./component";
import {Autobind} from "../decorators/autobind";
import {projectState} from "../util/state-management";
import {ProjectItem} from "./project-item";

//? THIS CLASS WILL HELP US CREATE A LIST OF THE PROJECTS CREATED BY THE USER INPUTS
export class ProjectList
  extends Component<HTMLDivElement, HTMLElement>
  implements DragTarget
{
  assignedProjects: Project[];

  //? HERE THE CONSTRUCTOR TAKES A TYPE THAT CHANGES DYNAMICALLY DEPENDING ON THE STATUS OF THE PROJECT
  //? THIS IS GING TO ADD A "TYPE PROPERTY ATTACHED TO THE CLASS WITH THE SAME NAME"
  constructor(private type: "active" | "finished") {
    super("project-list", "app", false, `${type}-projects`);
    this.assignedProjects = [];

    this.configure();
    this.renderContent();
  }

  //? THIS METHOD ITS THE ONE THAT RENDERS THE PROJECT DEPENDING ON ITS PROJECT STATUS AND ADDS IT
  //? TO THE LIST IN THE CORRECT TYPE SECTION
  private renderProjects() {
    const listEl = document.getElementById(
      `${this.type}-projects-list`
    )! as HTMLUListElement;

    listEl.innerHTML = "";
    for (const prjItem of this.assignedProjects) {
      new ProjectItem(this.element.querySelector("ul")!.id, prjItem);
    }
  }

  @Autobind
  dragOverHandler(event: DragEvent) {
    if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
      event.preventDefault();
      const listEl = this.element.querySelector("ul")!;
      listEl.classList.add("droppable");
    }
  }

  @Autobind
  dropHandler(event: DragEvent) {
    const prjId = event.dataTransfer!.getData("text/plain");
    projectState.moveProject(
      prjId,
      this.type === "active" ? ProjectStatus.Active : ProjectStatus.Finished
    );
  }

  @Autobind
  dragLeaveHandler(_: DragEvent) {
    const listEl = this.element.querySelector("ul")!;
    listEl.classList.remove("droppable");
  }

  configure() {
    this.element.addEventListener("dragover", this.dragOverHandler);
    this.element.addEventListener("dragleave", this.dragLeaveHandler);
    this.element.addEventListener("drop", this.dropHandler);

    //? HERE WE REGISTER A LISTENER FUNCTION THAT WILL BE CALLED
    //! WE CALL THE LISTENER TO TELL THE CODE THERE IS A STATE CHANGE WHEN WE RENDER THE CREATED
    //! PROJECT AND CREATE A LIST WITH RENDERPROJECT METHOD
    projectState.addListener((projects: Project[]) => {
      //? THIS PART WILL FILTER THE PROJECTS DEPENDING ON THE STATUS BEFORE RENDERING
      const relevantProjects = projects.filter((prj) => {
        if (this.type === "active") {
          return prj.status === ProjectStatus.Active;
        }
        return prj.status === ProjectStatus.Finished;
      });

      this.assignedProjects = relevantProjects;
      this.renderProjects();
    });
  }
  renderContent() {
    //? HERE WE ADD AN ID TO THE UL BASED ON THE TYPE OF THE SORROUNDING SECTION
    const listId = `${this.type}-projects-list`;
    this.element.querySelector("ul")!.id = listId;

    //? HERE WE SET THE TEXT OF THE H2 DEPENDING ON THE TYPE
    this.element.querySelector("h2")!.textContent =
      this.type.toUpperCase() + " PROJECTS";
  }
}
