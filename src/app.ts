//* DRAG & DROP

interface Draggable {
  dragStartHandler(event: DragEvent): void;
  dragEndHandler(event: DragEvent): void;
}

interface DragTarget {
  dragOverHandler(event: DragEvent): void;
  dropHandler(event: DragEvent): void;
  dragLeaveHandler(event: DragEvent): void;
}

//* PROJECT TYPE CLASS

//? THIS ENUM HELPS US TO SET THE STATUS OF THE PROJECT AND WILL HELP US WITH THE FILTERING
enum ProjectStatus {
  Active,
  Finished,
}

//? WE CREATE A NEW CLASS THAT WILL BE A DEDICATED CLASS THAT WILL HELP US BUILD 'PROJECT OBJECTS'
//? THAT WILL HAVE THE SAME STRUCTURE ALL ALONG
class Project {
  //? USING PUBLIC IN THE CONSTRUCTOR BEFOR EACH ARGUMENT WILL HELP US TO USE THE PROPERTIES
  //? ALL ALONG THE CODE WHEN WE USE 'PROJECT' OBJECTS
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus
  ) {}
}

//* STATE MANAGEMENT

//? HERE WE CREATE A CUSTOM TYPE OF LISTENER FOR ALL LISTENERS WILL HAVE ALWAYS THE SAME ARGUMENTS
//? AND RETURN TYPE

type Listener<T> = (items: T[]) => void;

class State<T> {
  protected listeners: Listener<T>[] = [];

  //! THE LISTENER FUNCTION AT THE END IS JUST A WAY TO MAKE THE CODE "LISTEN" WHEN WE CHANGE
  //! SOMETHING RELEVANT AND WHAT TO DO WHEN TIS HAPPENS
  addListener(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn);
  }
}

//? THIS CLASS WILL HELP US TO MANAGE THE STATE AND DO SOMETHING WHENEVER SOMETHING CHANGES IN THE
//? WEB PAGE
class ProjectState extends State<Project> {
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
const projectState = ProjectState.getInstance();

//* VALIDATION
//? HERE WE CREATE THE INTERFACE THAT RECIBES AN OBJECT TO BE VALIDATED
interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

//? THIS FUNCTION ITS THE ONE THA RECIVES EACH INPUT AS A "VALIDATABLE OBJECT" AND ACORDING TO ITS
//? PROPERTIES WE VALIDATE DEPENDING ITS VALUE
function validate(validatableInput: Validatable) {
  let isValid = true;
  if (validatableInput.required) {
    isValid = isValid && validatableInput.value.toString().trim().length !== 0;
  }
  if (
    validatableInput.minLength != null &&
    typeof validatableInput.value === "string"
  ) {
    isValid =
      isValid && validatableInput.value.length > validatableInput.minLength;
  }
  if (
    validatableInput.maxLength != null &&
    typeof validatableInput.value === "string"
  ) {
    isValid =
      isValid && validatableInput.value.length < validatableInput.maxLength;
  }
  if (
    validatableInput.min != null &&
    typeof validatableInput.value === "number"
  ) {
    isValid = isValid && validatableInput.value > validatableInput.min;
  }
  if (
    validatableInput.max != null &&
    typeof validatableInput.value === "number"
  ) {
    isValid = isValid && validatableInput.value < validatableInput.max;
  }
  return isValid;
}

//* DECORATORS
//? WE NEED TO CREATE A DECORATOR FOR THE BINDING OF THE THIS KEYWORD
function Autobind(
  //? USING THE _ WE TELL TYPESCRIPT TO IGNORE UNUSED VARIABLES
  _target: any,
  _methodName: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      //?? HERE WE BIND THE THIS KEYWORD TO THE METHOD THAT USES THE DECORATOR
      const boundFn = originalMethod.bind(this);
      return boundFn;
    },
  };
  return adjDescriptor;
}

//* COMPONENT BASE CLASS

abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  //? FIRST WE SELECT THE ELEMENTS THAT WE'LL NEED (THE CONTENT AND WHERE TO RENDER IT SAME AS IN THE PROJECT
  //? INPUT CLASS)

  //? WHAT I'M GOING TO RENDER
  templateElement: HTMLTemplateElement;

  //? WHERE I RENDER THE CONTENT
  hostElement: T;

  //? THE TYPE CONTENT IM COING TO RENDER
  element: U;

  constructor(
    templateId: string,
    hostElementId: string,
    insertAtStart: boolean,
    newElementId?: string
  ) {
    this.templateElement = document.getElementById(
      templateId
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById(hostElementId)! as T;

    const importedContent = document.importNode(
      this.templateElement.content,
      true
    );

    this.element = importedContent.firstElementChild as U;

    if (newElementId) {
      //? HERE WE USE THE "TYPE THAT CHANGES DYNAMICALLY"
      this.element.id = newElementId;
    }
    this.attach(insertAtStart);
  }

  //? WITH THIS LINE OF COD3E WE SELECT THE POSITION WHERE WE WANT THE ELEMENT
  //? TO BE INSERTED IN THIS CASE WE SELECT AFTER THE OPENNING <DIV> FOR EXAMPLE (FIRST ARGUMENT)
  //? AS SECOND ARGUMENT WE INSERT EXACTLY WHAT WE WANT TO INSERT IN THIS CASE THE FORM ELEMENT
  private attach(insertAtBeginning: boolean) {
    this.hostElement.insertAdjacentElement(
      insertAtBeginning ? "afterbegin" : "beforeend",
      this.element
    );
  }

  abstract configure(): void;
  abstract renderContent(): void;
}

//* PROJECT ITEM CLASS

class ProjectItem
  extends Component<HTMLUListElement, HTMLLIElement>
  implements Draggable
{
  private project: Project;

  get persons() {
    if (this.project.people === 1) return "1 person";
    return `${this.project.people} persons`;
  }

  constructor(hostId: string, project: Project) {
    super("single-project", hostId, false, project.id);
    this.project = project;

    this.configure();
    this.renderContent();
  }

  @Autobind
  dragStartHandler(event: DragEvent) {
    event.dataTransfer!.setData("text/plain", this.project.id);
    event.dataTransfer!.effectAllowed = "move";
  }

  dragEndHandler(_: DragEvent) {
    console.log("DragEnd");
  }

  configure() {
    this.element.addEventListener("dragstart", this.dragStartHandler);
    this.element.addEventListener("dragend", this.dragEndHandler);
  }

  renderContent() {
    this.element.querySelector("h2")!.textContent = this.project.title;
    this.element.querySelector("h3")!.textContent = this.persons + " assigned";
    this.element.querySelector("p")!.textContent = this.project.description;
  }
}

//* PROJECT LIST CLASS

//? THIS CLASS WILL HELP US CREATE A LIST OF THE PROJECTS CREATED BY THE USER INPUTS
class ProjectList
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

//? PROJECT INPUT CLASS
class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  //! WHE CAN USE HTML TYPES BECAUSE IN THE TSCONFIG WE ADDED THE DOM LIB
  //? INTERACTION WITH THE ELEMENT (THE DIFERENT INPUTS ELEMENTS)
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    super("project-input", "app", true, "user-input");

    //? HERE WE ASSIGN THE CONNECTION WITH THE HTML AND THE POSITION OF EACH INPUT
    this.titleInputElement = this.element.querySelector(
      "#title"
    ) as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector(
      "#description"
    ) as HTMLInputElement;
    this.peopleInputElement = this.element.querySelector(
      "#people"
    ) as HTMLInputElement;

    //? CALL THE CONFIGURATION OF THE EVENT LISTENER FOR EACH ELEMENT
    this.configure();
  }

  //? HERE WE GATHER THE USER INPUTS AND VALIDATE THEM WE ARE RETURNING A TUPLE AS [STRING,STRING,NUMBER]
  //? OR VOID
  private generateUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleInputElement.value;
    const enteredDescription = this.descriptionInputElement.value;
    const enteredPeople = this.peopleInputElement.value;

    //? WE USE THE VALIDATABLE INTERFACE WE CREATED WITH THE VALUES WE REQUIRE TO VALIDATE EACH INPUT
    const titleValidatable: Validatable = {
      value: enteredTitle,
      required: true,
    };
    const desacriptionValidatable: Validatable = {
      value: enteredDescription,
      required: true,
      minLength: 5,
    };

    const peopleValidatable: Validatable = {
      value: +enteredPeople,
      required: true,
      min: 3,
      max: 25,
    };

    //? WE ADD AN IF TO DO SOMETHING IN CASE ONE OF THE VALIDATED INPUTS FAILS
    if (
      !validate(titleValidatable) ||
      !validate(desacriptionValidatable) ||
      !validate(peopleValidatable)
    ) {
      alert("Invalid input, verify your data");
      return;
    } else {
      return [enteredTitle, enteredDescription, +enteredPeople];
    }
  }

  //? HERE WE CREATE A FUNCTION TO THE INPUTS WICH WILL BE USED AFTER WE DO SOMETHING WITH THEM
  private clearInputs() {
    this.titleInputElement.value = "";
    this.descriptionInputElement.value = "";
    this.peopleInputElement.value = "";
  }

  //? THIS RECIVES AN EVENT OBJECT AND BIND IT TO THE LISTENER WE NEED TO ADD THE DECORATOR TO ALLOW
  //? THE METHOD TO USE THE THIS KEYWORD FROM THE CLASS
  @Autobind
  private submitHandler(event: Event) {
    event.preventDefault();

    //?
    const userInput = this.generateUserInput();
    if (Array.isArray(userInput)) {
      const [title, description, people] = userInput;
      projectState.addProject(title, description, people);
      this.clearInputs();
    }
  }

  //? WHE ADD A LISTENER
  configure() {
    this.element.addEventListener("submit", this.submitHandler);
  }

  renderContent() {}
}

//? HERE WE INSTANCIATE THE PROJECT INPUT CLASS TO RENDER THE FORM
const prjInput = new ProjectInput();

//? IN THIS PART WE INSTANCIATE THE PROJECTLIST CLASS WITH EACH TYPE
const activeProjectList = new ProjectList("active");
const finishedProjectList = new ProjectList("finished");
