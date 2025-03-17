import { Controller, Get, Post, Patch, Delete, Body, Param, Request, UseGuards, Query } from '@nestjs/common';
import { TasksService } from '../services/tasks.service';
import { JwtAuthGuard } from '../../auth/middleware/jwt-auth.guard';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getTasks(@Query('status') status: string, @Request() req) {
    console.log('Request user:', req.user); // Debug log
    return this.tasksService.getTasks(req.user?.userId, status);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  createTask(@Body() body: { title: string; description?: string; status?: string }, @Request() req) {
    return this.tasksService.createTask({ ...body, user_id: req.user.userId });
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  updateTask(@Param('id') id: string, @Body() body: { title?: string; description?: string; status?: string }, @Request() req) {
    return this.tasksService.updateTask(id, body, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteTask(@Param('id') id: string, @Request() req) {
    return await this.tasksService.deleteTask(id, req.user.userId);
  }
  
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getTaskById(@Param('id') id: string, @Request() req) {
    return this.tasksService.getTaskById(id, req.user.userId);
  }
}
