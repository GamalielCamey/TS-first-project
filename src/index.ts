import {ProjectInput} from "./components/project-input";
import {ProjectList} from "./components/project-list";

//? HERE WE INSTANCIATE THE PROJECT INPUT CLASS TO RENDER THE FORM
new ProjectInput();

//? IN THIS PART WE INSTANCIATE THE PROJECTLIST CLASS WITH EACH TYPE
new ProjectList("active");
new ProjectList("finished");
