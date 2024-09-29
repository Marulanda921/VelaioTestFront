import { Component } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Task, Person } from '../../Models/task.model';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent {
  tarea: Task = {
    id: 0,
    title: '',
    completed: false,
    persons: []
  };

  newPerson: Person = {
    id: 0,
    fullName: '',
    age: 0,
    skills: []
  };

  newSkill: string = '';

  constructor(private taskService: TaskService) {}
  addPerson() {
    if (this.newPerson.fullName && this.newPerson.age > 0) {
      this.tarea.persons.push({ ...this.newPerson });
      this.resetPersonForm();
    } else {
      console.log('Completa los campos de nombre y edad.');
    }
  }

  removePerson(index: number) {
    this.tarea.persons.splice(index, 1);
  }

  addSkill() {
    if (this.newSkill.trim()) {
      this.newPerson.skills.push(this.newSkill.trim()); 
      this.newSkill = '';
    }
  }

  removeSkill(index: number) {
    this.newPerson.skills.splice(index, 1);
  }

  resetPersonForm() {
    this.newPerson = {
      id: 0,
      fullName: '',
      age: 0,
      skills: []
    };
    this.newSkill = '';
  }

  async onSubmit(): Promise<void> {
    console.log('Estado de la tarea:', this.tarea.completed);
    
    if (!this.tarea.title) {
      console.log('El título es obligatorio.');
      return;
    }

    try {
      const response = await this.taskService.createTask(this.tarea);
      console.log('Tarea creada:', response);
      this.resetForm();
    } catch (error) {
      console.error('Error al crear la tarea:', error);
    }
  }

  resetForm() {
    this.tarea = {
      id: 0,
      title: '',
      completed: false,
      persons: []
    };
    this.resetPersonForm();
  }
}
