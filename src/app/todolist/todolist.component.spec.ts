import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodolistComponent } from './todolist.component';
import { TodoService } from '../services/todo.service';
import { of } from 'rxjs';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('TodolistComponent', () => {
  let component: TodolistComponent;
  let fixture: ComponentFixture<TodolistComponent>;
  let mockTodoService: jest.Mocked<TodoService>;

  beforeEach(async () => {
    mockTodoService = {
      getTodos: jest.fn().mockReturnValue(of([])),
      createTodo: jest.fn(),
      updateTodo: jest.fn(),
      deleteTodo: jest.fn(),
    } as unknown as jest.Mocked<TodoService>;

    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
      ],
      providers: [{ provide: TodoService, useValue: mockTodoService }],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(TodolistComponent, {
        set: {
          template: `<div></div>`,
          styles: [],
        },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TodolistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load todos on init', () => {
    const mockTodos = [
      { _id: '1', description: 'Test 1', isCompleted: false, isEditable: false },
      { _id: '2', description: 'Test 2', isCompleted: true, isEditable: false },
    ];
    mockTodoService.getTodos.mockReturnValue(of(mockTodos));

    component.ngOnInit();

    fixture.detectChanges();

    expect(mockTodoService.getTodos).toHaveBeenCalled();
    expect(component.todos.length).toBe(2);
    expect(component.todos[0].description).toBe('Test 1');
  });

  it('should create a new todo on form submit', () => {
    const form = { value: { todo: 'New Todo' }, reset: jest.fn() };
    const mockNewTodo = {
      _id: '1',
      description: 'New Todo',
      isCompleted: false,
      isEditable: false,
    };
    mockTodoService.createTodo.mockReturnValue(of(mockNewTodo));

    component.handleSubmit(form as any);

    expect(mockTodoService.createTodo).toHaveBeenCalledWith({
      description: 'New Todo',
    });
    expect(component.todos.length).toBe(1);
    expect(component.todos[0].description).toBe('New Todo');
    expect(form.reset).toHaveBeenCalled();
  });

  it('should update todo status on checkbox change', () => {
    const mockTodo = {
      _id: '1',
      description: 'Test Todo',
      isCompleted: false,
      isEditable: false,
    };
    component.todos = [mockTodo];
    const event: MatCheckboxChange = { checked: true } as MatCheckboxChange;

    mockTodoService.updateTodo.mockReturnValue(
      of({ ...mockTodo, isCompleted: true })
    );
    component.handleStatusChange(event, '1');

    expect(mockTodoService.updateTodo).toHaveBeenCalledWith('1', {
      isCompleted: true,
    });
    expect(component.todos[0].isCompleted).toBe(true);
  });

  it('should delete a todo', () => {
    const mockTodo = {
      _id: '1',
      description: 'Test Todo',
      isCompleted: false,
      isEditable: false,
    };
    component.todos = [mockTodo];

    mockTodoService.deleteTodo.mockReturnValue(of(void 0));
    component.handleDelete('1');

    expect(mockTodoService.deleteTodo).toHaveBeenCalledWith('1');
    expect(component.todos.length).toBe(0);
  });
});
