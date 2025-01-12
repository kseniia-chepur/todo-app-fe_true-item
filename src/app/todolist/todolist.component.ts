import { Component, inject, OnInit } from '@angular/core';
import { Todo } from '../interfaces/todo';
import { TodoService } from '../services/todo.service';
import { FormsModule, NgForm } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  MatCheckboxChange,
  MatCheckboxModule,
} from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-todolist',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
  ],
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

  handleStatusChange(event: MatCheckboxChange, id: string) {
    const status = event.checked;

    this.todoService.updateTodo(id, { isCompleted: status }).subscribe({
      next: (data) => {
        this.todos = this.todos.map((todo) => {
          if (todo._id === id) {
            todo = data;
          }
          return todo;
        });
      },
      error: (error) => console.error(error.message),
    });
  }

  handleEdit(id: string) {
    this.todoService.updateTodo(id, { isEditable: true }).subscribe({
      next: (data) => {
        this.todos = this.todos.map((todo) => {
          if (todo._id === id) {
            todo = data;
          }
          return todo;
        });
      },
      error: (error) => console.error(error.message),
    });
  }

  handleSave(id: string) {
    const description = this.todos.find((todo) => todo._id === id)?.description;

    if (description) {
      this.todoService
        .updateTodo(id, { description, isEditable: false })
        .subscribe({
          next: (data) => {
            this.todos = this.todos.map((todo) => {
              if (todo._id === id) {
                todo = data;
              }
              return todo;
            });
          },
          error: (error) => console.error(error.message),
        });
    }
  }

  handleDelete(id: string) {
    this.todoService.deleteTodo(id).subscribe({
      next: () => {
        this.todos = this.todos.filter((todo) => todo._id !== id);
      },
      error: (error) => console.error(error.message),
    });
  }

  handleSubmit(formData: NgForm) {
    console.log(formData);
  }
}
