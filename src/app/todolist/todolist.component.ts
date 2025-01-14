import {
  Component,
  inject,
  OnInit,
  DestroyRef,
} from '@angular/core';
import { TodoService } from '../services/todo.service';
import { FormsModule, NgForm } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  MatCheckboxChange,
  MatCheckboxModule,
} from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { Todo } from '../interfaces/todo';

@Component({
  selector: 'app-todolist',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './todolist.component.html',
  styleUrl: './todolist.component.scss',
})
export class TodolistComponent implements OnInit {
  private todoService = inject(TodoService);

  todos: Todo[] = [];
  isLoading = true;

  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.isLoading = true;

    this.todoService
      .getTodos()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.todos = data;
        },
        error: (error) => console.error(error.message),
      })
      .add(() => (this.isLoading = false));
  }

  handleStatusChange(event: MatCheckboxChange, id: string) {
    const status = event.checked;

    this.todoService
      .updateTodo(id, { isCompleted: status })
      .pipe(takeUntilDestroyed(this.destroyRef))
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

  handleEdit(id: string) {
    this.todoService
      .updateTodo(id, { isEditable: true })
      .pipe(takeUntilDestroyed(this.destroyRef))
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

  handleSave(id: string) {
    const description = this.todos.find((todo) => todo._id === id)?.description;

    if (description) {
      this.todoService
        .updateTodo(id, { description, isEditable: false })
        .pipe(takeUntilDestroyed(this.destroyRef))
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
    this.todoService
      .deleteTodo(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.todos = this.todos.filter((todo) => todo._id !== id),
        error: (error) => console.error(error.message),
      });
  }

  handleSubmit(form: NgForm) {
    // event.preventDefault();

    const description = form.value.todo;

    this.todoService
      .createTodo({ description })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => this.todos.unshift(data),
        error: (error) => console.error(error.message),
      });

    form.reset();
  }
}
