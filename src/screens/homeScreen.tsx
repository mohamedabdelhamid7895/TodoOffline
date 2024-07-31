/* eslint-disable prettier/prettier */
import React, {useEffect} from 'react';
import {View, StyleSheet, Button} from 'react-native';
import {useDispatch} from 'react-redux';
import TodoList from '../components/todoList';
import {fetchTodos, syncTodos} from '../redux/todoThunks';
import {AppDispatch} from '../redux/store';

const HomeScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchTodos() as any);
  }, [dispatch]);

  const handleSync = () => {
    dispatch(syncTodos() as any);
  };

  return (
    <View style={styles.container}>
      <TodoList />
      <Button title="Sync" onPress={handleSync} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F2F2F7',
  },
});

export default HomeScreen;
