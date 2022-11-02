//? THIS ENUM HELPS US TO SET THE STATUS OF THE PROJECT AND WILL HELP US WITH THE FILTERING
export enum ProjectStatus {
  Active,
  Finished,
}

//? WE CREATE A NEW CLASS THAT WILL BE A DEDICATED CLASS THAT WILL HELP US BUILD 'PROJECT OBJECTS'
//? THAT WILL HAVE THE SAME STRUCTURE ALL ALONG
export class Project {
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
