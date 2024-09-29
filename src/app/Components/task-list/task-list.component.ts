import { Component } from '@angular/core';
import { Task, Person } from '../../Models/task.model';
import { TaskService } from '../../services/task.service';


@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  selectedFilter: string = 'all';

  constructor(private taskService: TaskService) {}

  async ngOnInit(): Promise<void> {
    await this.loadTasks();
  }

  async loadTasks(): Promise<void> {
    try {
      this.tasks = await this.taskService.getAllTasks();
      this.filteredTasks = this.tasks;
    } catch (error) {
      console.error('Error al cargar las tareas:', error);
    }
  }

  filterTasks(): void {
    if (this.selectedFilter === 'completed') {
      this.filteredTasks = this.tasks.filter(task => task.completed);
    } else if (this.selectedFilter === 'pending') {
      this.filteredTasks = this.tasks.filter(task => !task.completed);
    } else {
      this.filteredTasks = this.tasks;
    }
  }

  async addPersonToTask(taskId: number | undefined): Promise<void> {
    if (taskId === undefined) {
      console.error('Task ID is undefined');
      return;
    }

    const newPersonName = prompt('Introduce el nombre de la nueva persona:')?.trim() || '';
    const newPersonAgeStr = prompt('Introduce la edad de la nueva persona:')?.trim() || '';
    const newPersonAge = Number(newPersonAgeStr);
    const newPersonSkillsStr = prompt('Introduce las skills de la nueva persona (separadas por comas):')?.trim() || '';

    if (newPersonName && newPersonAge > 0) {
      const newPersonSkills = newPersonSkillsStr.split(',').map(skill => skill.trim());

      const newPerson: Person = {
        fullName: newPersonName,
        age: newPersonAge,
        skills: newPersonSkills
      };

      try {
        await this.taskService.addPersonToTask(taskId, newPerson);
        await this.loadTasks();
      } catch (error) {
        console.error('Error al agregar persona a la tarea:', error);
      }
    } else {
      alert('Por favor, proporciona un nombre válido y una edad positiva.');
    }
  }

  async removePersonFromTask(taskId: number | undefined, person: Person): Promise<void> {
    if (taskId === undefined) {
      console.error('Task ID is undefined');
      return;
    }

    const confirmation = confirm('¿Estás seguro de que deseas eliminar esta persona?');
    if (confirmation) {
      try {
        await this.taskService.deleteTask(taskId);
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
          task.persons = task.persons.filter(p => p !== person);
        }
        await this.loadTasks();
      } catch (error) {
        console.error('Error al eliminar persona de la tarea:', error);
      }
    }
  }

  async addSkillToPerson(taskId: number | undefined, person: Person): Promise<void> {
    if (taskId === undefined) {
      console.error('Task ID is undefined');
      return;
    }

    const newSkill = prompt('Introduce la nueva habilidad:')?.trim() || '';
    if (newSkill) {
      try {
        await this.taskService.addSkillsToPerson(person.id!, [newSkill]);
        person.skills.push(newSkill);
      } catch (error) {
        console.error('Error al agregar habilidad a la persona:', error);
      }
    }
  }

  async removeSkillFromPerson(taskId: number | undefined, person: Person): Promise<void> {
    if (taskId === undefined) {
      console.error('Task ID is undefined');
      return;
    }

    const skillToRemove = prompt('Introduce la habilidad a eliminar:')?.trim() || '';
    if (skillToRemove) {
      try {
        await this.taskService.removeSkillsFromPerson(person.id!, [skillToRemove]);
        person.skills = person.skills.filter(skill => skill !== skillToRemove);
      } catch (error) {
        console.error('Error al eliminar habilidad de la persona:', error);
      }
    }
  }
}
