/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { getRealm, realmToTodo } from '../models/todoSchema';
import * as api from './api';
import TodoSchema from '../models/todoSchema';
import { Todo } from '../types/index';
import Realm from 'realm';
import { convertDates } from '../utils/todoUtils';
import NetInfo from '@react-native-community/netinfo';

// Function to do background synchronization
export const backgroundSync = async (): Promise<void> => {
  const realm = await getRealm();
  // Get all todos that need syncing
  const todosToSync = realm
    .objects<TodoSchema>('Todo')
    .filtered('needsSync = true')
    .snapshot();

  for (let todo of todosToSync) {
    try {
      let syncedTodo: Todo;
      realm.write(async () => {
        if (todo.id.startsWith('local_')) {
          // If it's a new  todo, add it to the server
          const { id, ...todoData } = realmToTodo(todo);
          syncedTodo = await api.addTodo(todoData);

          realm.create<TodoSchema>(
            'Todo',
            {
              ...syncedTodo,
              needsSync: false,
              ...convertDates(syncedTodo),
            },
            Realm.UpdateMode.Modified,
          );
          realm.delete(todo);
        } else {
          // If it's existing todo, update it on the server
          syncedTodo = await api.updateTodo(realmToTodo(todo));

          // Update local todo with server data
          realm.create<TodoSchema>(
            'Todo',
            {
              ...syncedTodo,
              needsSync: false,
              ...convertDates(syncedTodo),
            },
            Realm.UpdateMode.Modified,
          );
        }
      });
    } catch (error) {
      console.error('Sync failed for todo:', todo.id, error);
    }
  }
};

// Set up a listener for network connectivity changes
NetInfo.addEventListener(state => {
  if (state.isConnected) {
    // If connected to the internet, do background sync
    backgroundSync();
  }
});