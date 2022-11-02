export abstract class Component<T extends HTMLElement, U extends HTMLElement> {
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
