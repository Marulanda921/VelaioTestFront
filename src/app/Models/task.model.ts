export interface Person {
  id?: number;
  fullName: string;
  age: number;
  skills: string[];
}

export interface Task {
  id?: number;
  title: string;
  completed: boolean;
  persons: Person[];
}

export interface NewPerson {
  fullName: string;
  age: number;
  skills: string[];
  skillsString: string;
}