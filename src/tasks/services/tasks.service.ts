import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task } from '../models/task.schema';

@Injectable()
export class TasksService {
  constructor(@InjectModel('Task') private taskModel: Model<Task>) {}

  async getTasks(userId: string, status?: string) {
    console.log("Fetching tasks for user:", userId, "with status:", status);
    
    const filter: any = { user_id: userId };
  
    if (status) {
      filter.status = status;
    }
  
    const tasks = await this.taskModel.find(filter);
    console.log("Fetched tasks:", tasks);
    return tasks;
  }
  

  async createTask(taskDto: { title: string; description?: string; status?: string; user_id: string }): Promise<Task> {
    const task = new this.taskModel(taskDto);
    return task.save();
  }

  async updateTask(id: string, updateDto: { title?: string; description?: string; status?: string }): Promise<Task> {
    const updatedTask = await this.taskModel.findByIdAndUpdate(id, updateDto, { new: true }).exec();
    if (!updatedTask) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return updatedTask;
  }

  async deleteTask(id: string): Promise<Task> {
    const deletedTask = await this.taskModel.findByIdAndDelete(id).exec();
    if (!deletedTask) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return deletedTask;
  }
}