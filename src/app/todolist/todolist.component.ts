import { Component, inject, OnInit } from '@angular/core';
import { Todo } from '../interfaces/todo';
import { TodoService } from '../services/todo.service';

@Component({
  selector: 'app-todolist',
  standalone: true,
  imports: [],
  templateUrl: './todolist.component.html',
  styleUrl: './todolist.component.scss',
})
export class TodolistComponent implements OnInit {
  private todoService = inject(TodoService);

  todos: Todo[] = [];

  ngOnInit(): void {
    this.todoService.getTodos().subscribe({
      next: (data) => (this.todos = data),
      error: (error) => console.error(error.message),
    });
  }
}
