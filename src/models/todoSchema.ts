/* eslint-disable prettier/prettier */
import Realm from 'realm';
import {Todo} from '../types';

class TodoSchema extends Realm.Object<TodoSchema> {
  id!: string;
  title!: string;
  description!: string;
  status!: 'todo' | 'done';
  createdAt!: Date;
  updatedAt!: Date;
  needsSync!: boolean;

  static schema: Realm.ObjectSchema = {
    name: 'Todo',
    primaryKey: 'id',
    properties: {
      id: 'string',
      title: 'string',
      description: 'string',
      status: 'string',
      createdAt: 'date',
      updatedAt: 'date',
      needsSync: 'bool',
    },
  };
}

export const getRealm = async (): Promise<Realm> => {
  return await Realm.open({
    schema: [TodoSchema],
    schemaVersion: 1,
  });
};

export const realmToTodo = (realmObject: TodoSchema): Todo => {
  return {
    id: realmObject.id,
    title: realmObject.title,
    description: realmObject.description,
    status: realmObject.status,
    createdAt: realmObject.createdAt.toISOString(),
    updatedAt: realmObject.updatedAt.toISOString(),
    needsSync: realmObject.needsSync,
  };
};

export default TodoSchema;
