/* eslint-disable prettier/prettier */
/* eslint-disable curly */
import {Todo} from '../types';
import TodoSchema from '../models/todoSchema';

export const convertDates = (todo: Todo): TodoSchema => ({
  ...todo,
  createdAt: new Date(todo.createdAt),
  updatedAt: new Date(todo.updatedAt),
} as TodoSchema);

export const realmToTodo = (realmTodo: TodoSchema): Todo => ({
  id: realmTodo.id,
  title: realmTodo.title,
  status: realmTodo.status,
  createdAt: realmTodo.createdAt.toISOString(),
  updatedAt: realmTodo.updatedAt.toISOString(),
  needsSync: realmTodo.needsSync,
});

export const sortTodos = (todos: Todo[]): Todo[] => {
  return todos.sort((a, b) => {
    if (a.needsSync && !b.needsSync) return -1;
    if (!a.needsSync && b.needsSync) return 1;
    return 0;
  });
};

export const createNewTodo = (
  todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt' | 'needsSync'>,
): Todo => {
  const now = new Date().toISOString();
  return {
    ...todo,
    id: `local_${Date.now()}`,
    createdAt: now,
    updatedAt: now,
    needsSync: true,
    description: '',
  };
};
