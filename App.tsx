/* eslint-disable eol-last */
/* eslint-disable prettier/prettier */
import React from 'react';
import {SafeAreaView, StyleSheet, StatusBar} from 'react-native';
import {Provider} from 'react-redux';
import {store} from './src/redux/store';
import TodoList from './src/components/todoList';
 import Realm from 'realm';
 Realm.flags.THROW_ON_GLOBAL_REALM = true;

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <TodoList />
      </SafeAreaView>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
});

export default App;