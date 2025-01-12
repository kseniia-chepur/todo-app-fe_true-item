import { Todo } from './todo';

export interface ApiGetResponse {
  message: string;
  todos: Todo[];
}
