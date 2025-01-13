import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Todo } from '../interface/todo';
import { ApiResponse } from '../interface/apiResponse';
import { ApiGetResponse } from '../interface/apiGetResponse';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private http = inject(HttpClient);
  private apiUrl = environment.API_URL;

  createTodo(todoDescription: Partial<Todo>): Observable<Todo> {
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
