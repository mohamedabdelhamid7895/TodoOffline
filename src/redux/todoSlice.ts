/* eslint-disable prettier/prettier */
/* eslint-disable eol-last */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Todo, RootState } from '../types';
import {
  fetchTodos,
  addTodo,
  updateTodo,
  deleteTodo,
  syncTodos,
} from './todoThunks';

// Define interface of our Todo state
interface TodoState {
  items: Todo[];
  loading: boolean;
  error: string | null;
}
// Set up the initial state for our todos
const initialState: TodoState = {
  items: [],
  loading: false,
  error: null,
};

// Create a slice to manage todo state
const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {}, 
  extraReducers: builder => {
    builder
      // Handle the pending state of fetchTodos
      .addCase(fetchTodos.pending, state => {
        state.loading = true;
        state.error = null;
      })
      // Handle the fulfilled state of fetchTodos
      .addCase(fetchTodos.fulfilled, (state, action: PayloadAction<Todo[]>) => {
        state.items = action.payload;
        state.loading = false;
      })
      // Handle the rejected state of fetchTodos
      .addCase(fetchTodos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Handle the fulfilled state of addTodo
      .addCase(addTodo.fulfilled, (state, action: PayloadAction<Todo>) => {
        state.items.push(action.payload);
      })
      // Handle the rejected state of addTodo
      .addCase(addTodo.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Handle the fulfilled state of updateTodo
      .addCase(updateTodo.fulfilled, (state, action: PayloadAction<Todo>) => {
        const index = state.items.findIndex(
          todo => todo.id === action.payload.id,
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      //here Handle the fulfilled state of deleteTodo
      .addCase(deleteTodo.fulfilled, (state, action: PayloadAction<string>) => {
        state.items = state.items.filter(todo => todo.id !== action.payload);
      })
      // Handle the fulfilled  of syncTodos
      .addCase(syncTodos.fulfilled, (state, action: PayloadAction<Todo[]>) => {
        state.items = action.payload;
      })
      //here Handle the rejected state of syncTodos
      .addCase(syncTodos.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

// Selectors
// These functions allow us to easily select parts of the state in  components
export const selectTodos = (state: RootState) => state.todos.items;
export const selectTodoLoading = (state: RootState) => state.todos.loading;
export const selectTodoError = (state: RootState) => state.todos.error;

// Export the reducer
export default todoSlice.reducer;