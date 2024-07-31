/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
import {useState, useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {Alert} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import {AppDispatch} from '../../redux/store';
import {
  addTodo,
  updateTodo,
  deleteTodo,
  fetchTodos,
  syncTodos,
} from '../../redux/todoThunks';
import {Todo} from '../../types';

export const useTodoActions = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [localError, setLocalError] = useState<string | null>(null);

  const handleAddTodo = async (
    todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt' | 'needsSync'>,
  ) => {
    setLocalError(null);
    try {
      await dispatch(addTodo(todo) as any).unwrap();
    } catch (err) {
      setLocalError('Failed to add todo. Please try again.');
    }
  };

  const handleUpdateTodo = async (todo: Todo) => {
    setLocalError(null);
    try {
      await dispatch(updateTodo(todo) as any).unwrap();
    } catch (err) {
      setLocalError('Failed to update todo. Please try again.');
    }
  };

  const handleDeleteTodo = async (id: string) => {
    Alert.alert('Delete Todo', 'Are you sure you want to delete this todo?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'OK',
        onPress: async () => {
          setLocalError(null);
          try {
            await dispatch(deleteTodo(id) as any).unwrap();
          } catch (err) {
            setLocalError('Failed to delete todo. Please try again.');
          }
        },
      },
    ]);
  };

  return {
    addTodo: handleAddTodo,
    updateTodo: handleUpdateTodo,
    deleteTodo: handleDeleteTodo,
    localError,
  };
};

export const useTodoSync = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [isSyncing, setIsSyncing] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    dispatch(fetchTodos() as any);
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected ?? false);
      if (state.isConnected) {
        handleSync();
      }
    });
    return () => unsubscribe();
  }, [dispatch]);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await dispatch(syncTodos() as any).unwrap();
      Alert.alert('Success', 'Todos synced successfully');
    } catch (err) {
      console.error('Failed to sync todos:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  return {handleSync, isSyncing, isOnline};
};
