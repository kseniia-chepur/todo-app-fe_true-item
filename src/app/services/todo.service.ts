import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Todo } from '../interfaces/todo';
import { ApiResponse } from '../interfaces/apiResponse';
import { ApiGetResponse } from '../interfaces/apiGetResponse';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3005';

  createTodo(todoDescription: string): Observable<Todo> {
    return this.http
      .post<ApiResponse>(this.apiUrl, todoDescription)
      .pipe(map((response) => response.todo));
  }

  getTodos(): Observable<Todo[]> {
    return this.http
      .get<ApiGetResponse>(this.apiUrl)
      .pipe(map((response) => response.todos));
  }

  updateTodo(id: string, updateField: Partial<Todo>): Observable<Todo> {
    return this.http
      .patch<ApiResponse>(this.apiUrl + `/${id}`, updateField)
      .pipe(map((response) => response.todo));
  }

  deleteTodo(id: string): Observable<void> {
    return this.http.delete<void>(this.apiUrl + `/${id}`);
  }
}
