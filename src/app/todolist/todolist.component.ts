import { Component, inject, OnInit } from '@angular/core';
import { Todo } from '../interfaces/todo';
import { TodoService } from '../services/todo.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FormsModule, NgForm } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-todolist',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatCheckboxModule,
  ],
  templateUrl: './todolist.component.html',
  styleUrl: './todolist.component.scss',
})
export class TodolistComponent implements OnInit {
  private todoService = inject(TodoService);

  displayedColumns: string[] = [
    'description',
    'isCompleted',
    'Edit',
    'Save',
    'Delete',
  ];
  dataSource: MatTableDataSource<Todo>;

  todos: Todo[] = [];

  ngOnInit(): void {
    this.todoService.getTodos().subscribe({
      next: (data) => {
        (this.todos = data),
          (this.dataSource = new MatTableDataSource(this.todos));
      },
      error: (error) => console.error(error.message),
    });
  }

  handleSubmit(formData: NgForm) {
    console.log(formData);
  }
}
