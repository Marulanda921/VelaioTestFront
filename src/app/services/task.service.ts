// src/app/services/task.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Task, Person } from '../Models/task.model';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private baseUrl = 'http://localhost:9002/api/tasks';

  constructor(private http: HttpClient) {}

  async createTask(task: Task): Promise<Task> {
    return await lastValueFrom(this.http.post<Task>(`${this.baseUrl}`, task));
  }
  async getAllTasks(): Promise<Task[]> {
    return await lastValueFrom(this.http.get<Task[]>(`${this.baseUrl}`));
  }
  async markTaskAsCompleted(taskId: number): Promise<void> {
    return await lastValueFrom(this.http.put<void>(`${this.baseUrl}/${taskId}/complete`, {}));
  }
  async filterTasksByStatus(completed: boolean): Promise<Task[]> {
    return await lastValueFrom(this.http.get<Task[]>(`${this.baseUrl}/filter?completed=${completed}`));
  }
  async addPersonToTask(taskId: number, person: Person): Promise<void> {
    return await lastValueFrom(this.http.post<void>(`${this.baseUrl}/${taskId}/persons`, person));
  }
  async deleteTask(taskId: number): Promise<void> {
    return await lastValueFrom(this.http.delete<void>(`${this.baseUrl}/${taskId}`));
  }
  async addSkillsToPerson(personId: number, skills: string[]): Promise<void> {
    return await lastValueFrom(
      this.http.post<void>(`${this.baseUrl}/persons/${personId}/skills`, { skills })
    );
  }
  async removeSkillsFromPerson(personId: number, skills: string[]): Promise<void> {
    return await lastValueFrom(
      this.http.delete<void>(`${this.baseUrl}/persons/${personId}/skills`, { body: { skills } })
    );
  }
}
