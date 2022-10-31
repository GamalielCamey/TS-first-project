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

//* PROJECT INPUT CLASS

//? THIS CLASS WILL HELP US CREATE A LIST OF THE PROJECTS CREATED BY THE USER INPUTS
class ProjectList {
  //? FIRST WE SELECT THE ELEMENTS THAT WE'LL NEED (THE CONTENT AND WHERE TO RENDER IT SAME AS IN THE PROJECT
  //? INPUT CLASS)
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLElement;

  //? HERE THE CONSTRUCTOR TAKES A TYPE THAT CHANGES DYNAMICALLY DEPENDING ON THE STATUS OF THE PROJECT
  //? THIS IS GING TO ADD A "TYPE PROPERTY ATTACHED TO THE CLASS WITH THE SAME NAME"
  constructor(private type: "active" | "finished") {
    this.templateElement = document.getElementById(
      "project-list"
    )! as HTMLTemplateElement;

    this.hostElement = document.getElementById("app")! as HTMLDivElement;

    const importedContent = document.importNode(
      this.templateElement.content,
      true
    );

    this.element = importedContent.firstElementChild as HTMLElement;

    //? HERE WE USE THE "TYPE THAT CHANGES DYNAMICALLY"
    this.element.id = `${this.type}-projects`;
    this.attach();
    this.renderContent();
  }

  private renderContent() {
    //? HERE WE ADD AN ID TO THE UL BASED ON THE TYPE OF THE SORROUNDING SECTION
    const listId = `${this.type}-projects-list`;
    this.element.querySelector("ul")!.id = listId;

    //? HERE WE SET THE TEXT OF THE H2 DEPENDING ON THE TYPE
    this.element.querySelector("h2")!.textContent =
      this.type.toUpperCase() + " PROJECTS";
  }

  //? HERE WE CREATE THE SAME METHOD TO RENDER LIKE IN THE PROJECTINPUT CLASS
  private attach() {
    this.hostElement.insertAdjacentElement("beforeend", this.element);
  }
}

class ProjectInput {
  //! WHE CAN USE HTML TYPES BECAUSE IN THE TSCONFIG WE ADDED THE DOM LIB

  //? WHAT I'M GOING TO RENDER
  templateElement: HTMLTemplateElement;

  //? WHERE I RENDER THE CONTENT
  hostElement: HTMLDivElement;

  //? THE TYPE CONTENT IM COING TO RENDER
  element: HTMLFormElement;

  //? INTERACTION WITH THE ELEMENT (THE DIFERENT INPUTS ELEMENTS)
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    //? GET THE POSITION IN THE HTML OF WHAT I'M GOING TO RENDER
    this.templateElement = document.getElementById(
      "project-input"
    )! as HTMLTemplateElement;

    //? GET THE POSITION IN THE HTML WHERE I'M GOING TO RENDER THE CONTENT
    this.hostElement = document.getElementById("app")! as HTMLDivElement;

    //? HERE WE IMPORT WHAT IS INSIDE THE TEMPLATE ELEMENT WICH IS EXACTLY WHAT WE WANT TO RENDER (THE FORM)
    //? IMPORTNODE ADDS A POINTER TO THE ELEMENT
    const importedContent = document.importNode(
      this.templateElement.content,
      true
    );

    //? HERE WE HAVE THE CONCRETE PROPERTY THAT POINTS AT THE NODE WE WANT TO INSERT
    this.element = importedContent.firstElementChild as HTMLFormElement;

    //? HERE WE SELECT THE ELEMENT AND ASSIGN IT AN "ID" SO THE CSS CAN GIVE ITS PROPERTIES
    this.element.id = "user-input";

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

    //? CALL THE METHOD TO EXECUTE THE PRIVATE FUNCTION AND RENDER
    this.attach();
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
      console.log(title, description, people);
      this.clearInputs();
    }
  }

  //? WHE ADD A LISTENER
  private configure() {
    this.element.addEventListener("submit", this.submitHandler);
  }

  private attach() {
    //? WITH THIS LINE OF COD3E WE SELECT THE POSITION WHERE WE WANT THE ELEMENT
    //? TO BE INSERTED IN THIS CASE WE SELECT AFTER THE OPENNING <DIV> FOR EXAMPLE (FIRST ARGUMENT)
    //? AS SECOND ARGUMENT WE INSERT EXACTLY WHAT WE WANT TO INSERT IN THIS CASE THE FORM ELEMENT
    this.hostElement.insertAdjacentElement("afterbegin", this.element);
  }
}

//? HERE WE INSTANCIATE THE PROJECT INPUT CLASS TO RENDER THE FORM
const prjInput = new ProjectInput();

//? IN THIS PART WE INSTANCIATE THE PROJECTLIST CLASS WITH EACH TYPE
const activeProjectList = new ProjectList("active");
const finishedProjectList = new ProjectList("finished");
