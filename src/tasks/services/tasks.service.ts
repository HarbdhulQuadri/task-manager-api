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

  async updateTask(id: string, updateDto: { title?: string; description?: string; status?: string }, userId: string): Promise<Task> {
    const updatedTask = await this.taskModel.findOneAndUpdate(
      { _id: id, user_id: userId },
      updateDto,
      { new: true }
    ).exec();
    if (!updatedTask) {
      throw new NotFoundException(`Task with ID ${id} not found or not owned by user`);
    }
    return updatedTask;
  }

  async deleteTask(taskId: string, userId: string): Promise<{ message: string }> {
    // Find the task with both the ID and the owner ID.
    const task = await this.taskModel.findOne({ _id: taskId, user_id: userId });
    if (!task) {
      throw new NotFoundException('Task not found or you are not authorized to delete this task');
    }
    await this.taskModel.findByIdAndDelete(taskId);
    return { message: 'Task deleted successfully' };
  }
  

  async getTaskById(id: string, userId: string): Promise<Task> {
    const task = await this.taskModel.findOne({ _id: id, user_id: userId }).exec();
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found or not owned by user`);
    }
    return task;
  }
}