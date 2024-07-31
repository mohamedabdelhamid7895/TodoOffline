/* eslint-disable prettier/prettier */
/* eslint-disable eol-last */
import axios from 'axios';
import {Todo} from '../types';

const API_URL = 'https://jsonplaceholder.typicode.com/todos';

export const fetchTodos = async (): Promise<Todo[]> => {
  try {
    const response = await axios.get(API_URL);
    return response.data.slice(0, 20).map((item: any) => ({
      id: item.id.toString(),
      title: item.title,
      description: '',
      status: item.completed ? 'done' : 'todo',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      needsSync: false,
    }));
  } catch (error) {
    console.error('Error fetching todos:', error);
    throw error;
  }
};

export const addTodo = async (
  todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt' | 'needsSync'>,
): Promise<Todo> => {
  try {
    const response = await axios.post(API_URL, {
      title: todo.title,
      completed: todo.status === 'done',
    });

    return {
      id: response.data.id.toString(),
      title: response.data.title,
      description: todo.description,
      status: response.data.completed ? 'done' : 'todo',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      needsSync: false,
    };
  } catch (error) {
    console.error('Error adding todo:', error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        `Failed to add todo: ${error.response.status} ${error.response.statusText}`,
      );
    } else {
      throw new Error('Failed to add todo: Network error');
    }
  }
};

export const updateTodo = async (todo: Todo): Promise<Todo> => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const response = await axios.put(`${API_URL}/${todo.id}`, {
      title: todo.title,
      completed: todo.status === 'done',
    });

    return {
      ...todo,
      updatedAt: new Date().toISOString(),
      needsSync: false,
    };
  } catch (error) {
    console.error('Error updating todo:', error);
    throw error;
  }
};

export const deleteTodo = async (id: string): Promise<string> => {
  try {
    await axios.delete(`${API_URL}/${id}`);
    return id;
  } catch (error) {
    console.error('Error deleting todo:', error);
    throw error;
  }
};