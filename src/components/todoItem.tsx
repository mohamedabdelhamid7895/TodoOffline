/* eslint-disable prettier/prettier */
/* eslint-disable eol-last */

import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Todo} from '../types';


interface TodoItemProps {
  item: Todo;
  onUpdate: (todo: Todo) => void;
  onDelete: (id: string) => void;
  onSync: () => Promise<void>;
}

const TodoItem: React.FC<TodoItemProps> = ({item, onUpdate, onDelete}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(item.title);

  const handleUpdate = () => {
    if (isEditing) {
      onUpdate({...item, title: editedTitle});
    }
    setIsEditing(!isEditing);
  };

  const handleStatusToggle = () => {
    onUpdate({...item, status: item.status === 'todo' ? 'done' : 'todo'});
  };

  // const renderSyncStatus = () => {
  //   if (item.needsSync) {
  //     return <Icon name="sync" size={24} color="#FFCC00" />;
  //   }
  //   return null;
  // };

  return (
    <View style={styles.todoItem}>
      <TouchableOpacity onPress={handleStatusToggle}>
        <Icon
          name={
            item.status === 'done' ? 'check-circle' : 'radio-button-unchecked'
          }
          size={24}
          color="#007AFF"
        />
      </TouchableOpacity>
      {isEditing ? (
        <TextInput
          style={styles.input}
          value={editedTitle}
          onChangeText={setEditedTitle}
          autoFocus
        />
      ) : (
        <Text
          style={[styles.todoTitle, item.status === 'done' && styles.todoDone]}>
          {item.title}
        </Text>
      )}
      <TouchableOpacity onPress={handleUpdate}>
        <Icon name={isEditing ? 'check' : 'edit'} size={24} color="#4CD964" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onDelete(item.id)}>
        <Icon name="delete" size={24} color="#FF3B30" />
      </TouchableOpacity>
      {/* {renderSyncStatus()} */}
    </View>
  );
};

const styles = StyleSheet.create({
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 3,
  },
  todoTitle: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  todoDone: {
    textDecorationLine: 'line-through',
    color: '#8E8E93',
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#007AFF',
  },
});

export default TodoItem;