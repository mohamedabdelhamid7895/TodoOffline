/* eslint-disable prettier/prettier */
/* eslint-disable eol-last */
import React, {useState} from 'react';
import {
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useSelector} from 'react-redux';
import TodoItem from './todoItem';
import {RootState, Todo} from '../types';
import {styles} from './todolistAssets/TodoListStyles';
import {useTodoActions, useTodoSync} from './todolistAssets/todoHooks';

const TodoList: React.FC = () => {
  const {items: todos, loading} = useSelector(
    (state: RootState) => state.todos,
  );
  const [newTodo, setNewTodo] = useState('');
  const {addTodo, updateTodo, deleteTodo, localError} = useTodoActions();
  const {handleSync, isSyncing, isOnline} = useTodoSync();

  const handleAddTodo = () => {
    if (newTodo.trim()) {
      addTodo({title: newTodo.trim(), description: '', status: 'todo'});
      setNewTodo('');
    }
  };

  const renderItem = ({item}: {item: Todo}) => (
    <TodoItem
      item={item}
      onUpdate={updateTodo}
      onDelete={deleteTodo}
      onSync={handleSync}
    />
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Icon name="list" size={24} color="#007AFF" />
          <Text style={styles.title}>Todo List</Text>
        </View>
        <TouchableOpacity onPress={handleSync} disabled={isSyncing}>
          <Icon
            name="sync"
            size={24}
            color={isSyncing ? '#8E8E93' : '#007AFF'}
          />
        </TouchableOpacity>
      </View>
      {localError && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{localError}</Text>
        </View>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newTodo}
          onChangeText={setNewTodo}
          placeholder="Add a new todo"
          returnKeyType="done"
          onSubmitEditing={handleAddTodo}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddTodo}>
          <Icon name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      <Text style={styles.statusText}>
        {isOnline ? 'Online' : 'Offline'} |{' '}
        {isSyncing ? 'Syncing...' : 'Synced'}
      </Text>
      {todos.length > 0 ? (
        <FlatList
          data={todos}
          renderItem={renderItem}
          keyExtractor={item => `${item.id}_${item.updatedAt}`}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Icon name="assignment" size={48} color="#8E8E93" />
          <Text style={styles.emptyText}>No todos yet. Add one above!</Text>
        </View>
      )}
    </View>
  );
};

export default TodoList;
