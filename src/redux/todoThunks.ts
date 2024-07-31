/* eslint-disable prettier/prettier */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getRealm } from '../models/todoSchema';
import * as api from '../services/api';
import NetInfo from '@react-native-community/netinfo';
import { Todo, RootState } from '../types';
import TodoSchema from '../models/todoSchema';
import Realm from 'realm';
import {
  convertDates,
  realmToTodo,
  sortTodos,
  createNewTodo,
} from '../utils/todoUtils';
import { backgroundSync } from '../services/syncService';

// Helper function to update local todos from server data
const updateLocalTodosFromServer = async (
  realm: Realm,
  serverTodos: Todo[],
) => {
  realm.write(() => {
    serverTodos.forEach(serverTodo => {
      const existingTodo = realm.objectForPrimaryKey<TodoSchema>(
        'Todo',
        serverTodo.id,
      );
      if (existingTodo && !existingTodo.needsSync) {
        // Update existing todo if it doesn't need sync
        realm.create<TodoSchema>(
          'Todo',
          convertDates(serverTodo),
          Realm.UpdateMode.Modified,
        );
      } else if (!existingTodo) {
        // Create new todo if it doesn't exist locally
        realm.create<TodoSchema>('Todo', convertDates(serverTodo));
      }
    });
  });
};

// Thunk to fetch todos
export const fetchTodos = createAsyncThunk<Todo[], void, {state: RootState}>(
  'todos/fetchTodos',
  async (_, { rejectWithValue }) => {
    try {
      const realm = await getRealm();
      let localTodos = Array.from(realm.objects<TodoSchema>('Todo')).map(
        realmToTodo,
      );

      // Check internet connection
      const netInfo = await NetInfo.fetch();
      if (netInfo.isConnected) {
        // If connected, fetch todos from server and update local database
        const serverTodos = await api.fetchTodos();
        await updateLocalTodosFromServer(realm, serverTodos);
        localTodos = Array.from(realm.objects<TodoSchema>('Todo')).map(
          realmToTodo,
        );
      }

      return sortTodos(localTodos);
    } catch (error) {
      console.error('Error fetching todos:', error);
      return rejectWithValue((error as Error).message);
    }
  },
);

// Thunk to add a new todo
export const addTodo = createAsyncThunk<
  Todo,
  Omit<Todo, 'id' | 'createdAt' | 'updatedAt' | 'needsSync'>,
  {state: RootState}
>('todos/addTodo', async (todo, { rejectWithValue }) => {
  try {
    const realm = await getRealm();
    const newTodo = createNewTodo(todo);

    realm.write(() => {
      realm.create<TodoSchema>(
        'Todo',
        convertDates(newTodo),
        Realm.UpdateMode.Modified,
      );
    });

    return newTodo;
  } catch (error) {
    console.error('Error adding todo:', error);
    return rejectWithValue((error as Error).message);
  }
});

// Thunk to update a todo
export const updateTodo = createAsyncThunk<Todo, Todo, {state: RootState}>(
  'todos/updateTodo',
  async (todo, { rejectWithValue }) => {
    try {
      const realm = await getRealm();
      const updatedTodo = {
        ...todo,
        updatedAt: new Date().toISOString(),
        needsSync: true,
      };

      let resultTodo: Todo;
      realm.write(() => {
        const realmTodo = realm.create<TodoSchema>(
          'Todo',
          convertDates(updatedTodo),
          Realm.UpdateMode.Modified,
        );
        resultTodo = realmToTodo(realmTodo);
      });

      return resultTodo!;
    } catch (error) {
      console.error('Error updating todo:', error);
      return rejectWithValue((error as Error).message);
    }
  },
);

// Thunk to delete a todo
export const deleteTodo = createAsyncThunk<string, string, {state: RootState}>(
  'todos/deleteTodo',
  async (id, { rejectWithValue }) => {
    try {
      const realm = await getRealm();
      realm.write(() => {
        const todo = realm.objectForPrimaryKey<TodoSchema>('Todo', id);
        if (todo) {
          realm.delete(todo);
        }
      });
      return id;
    } catch (error) {
      console.error('Error deleting todo:', error);
      return rejectWithValue((error as Error).message);
    }
  },
);

// Thunk to sync todos with the server
export const syncTodos = createAsyncThunk<Todo[], void, {state: RootState}>(
  'todos/syncTodos',
  async (_, { rejectWithValue }) => {
    try {
      const netInfo = await NetInfo.fetch();
      if (!netInfo.isConnected) {
        throw new Error('No internet connection');
      }

      // do background sync
      await backgroundSync();

      // get all todos from local database after sync
      const realm = await getRealm();
      const allTodos = Array.from(realm.objects<TodoSchema>('Todo')).map(
        realmToTodo,
      );
      return allTodos;
    } catch (error) {
      console.error('Error syncing todos:', error);
      return rejectWithValue((error as Error).message);
    }
  },
);