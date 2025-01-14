import { TestBed } from '@angular/core/testing';
import { provideHttpClient, HttpClient } from '@angular/common/http';
import { TodoService } from './todo.service';
import { Todo } from '../interface/todo';
import { environment } from '../../environments/environment';
import { of } from 'rxjs';
import { ApiResponse } from '../interface/apiResponse';
import { ApiGetResponse } from '../interface/apiGetResponse';

describe('TodoService', () => {
  let service: TodoService;
  let http: HttpClient;

  const apiUrl = environment.API_URL;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TodoService, provideHttpClient()],
    });
    service = TestBed.inject(TodoService);
    http = TestBed.inject(HttpClient);
  });

  it('should create a new todo', () => {
    const mockTodo: Todo = {
      _id: '1',
      description: 'New Todo',
      isCompleted: false,
      isEditable: false,
    };
    const todoDescription = { description: 'New Todo' };

    jest
      .spyOn(http, 'post')
      .mockReturnValue(of({ todo: mockTodo } as ApiResponse));

    service.createTodo(todoDescription).subscribe((todo) => {
      expect(todo).toEqual(mockTodo);
    });

    expect(http.post).toHaveBeenCalledWith(apiUrl, todoDescription);
  });

  it('should fetch all todos', () => {
    const mockTodos: Todo[] = [
      {
        _id: '1',
        description: 'Todo 1',
        isCompleted: false,
        isEditable: false,
      },
      { _id: '2', description: 'Todo 2', isCompleted: true, isEditable: false },
    ];

    jest
      .spyOn(http, 'get')
      .mockReturnValue(of({ todos: mockTodos } as ApiGetResponse));

    service.getTodos().subscribe((todos) => {
      expect(todos.length).toBe(2);
      expect(todos).toEqual(mockTodos);
    });

    expect(http.get).toHaveBeenCalledWith(apiUrl);
  });

  it('should update a todo', () => {
    const updatedTodo: Todo = {
      _id: '1',
      description: 'Updated Todo',
      isCompleted: true,
      isEditable: false,
    };
    const updateField = { isCompleted: true };

    jest
      .spyOn(http, 'patch')
      .mockReturnValue(of({ todo: updatedTodo } as ApiResponse));

    service.updateTodo('1', updateField).subscribe((todo) => {
      expect(todo).toEqual(updatedTodo);
    });

    expect(http.patch).toHaveBeenCalledWith(`${apiUrl}/1`, updateField);
  });

  it('should delete a todo', () => {
    const todoId = '1';

    jest.spyOn(http, 'delete').mockReturnValue(of(void 0));

    service.deleteTodo(todoId).subscribe(() => {
      expect(true).toBe(true);

      expect(http.delete).toHaveBeenCalledWith(`${apiUrl}/1`);
    });
  });
});
