/* eslint-disable prettier/prettier */
export interface Todo {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'done';
  createdAt: string;
  updatedAt: string;
  needsSync: boolean;
}

export interface ApiTodo {
  id: number;
  title: string;
  completed: boolean;
}

export interface RootState {
  todos: Todo[];
}

