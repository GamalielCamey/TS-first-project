import {Component} from "./component";
import {Validatable, validate} from "../util/validation";
import {Autobind} from "../decorators/autobind";
import {projectState} from "../util/state-management";

export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
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
