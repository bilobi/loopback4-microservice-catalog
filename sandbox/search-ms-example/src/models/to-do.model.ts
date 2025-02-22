import {Entity, model, property} from '@loopback/repository';

@model()
export class ToDo extends Entity {
  @property({
    type: 'string',
    id: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  description: string;

  constructor(data?: Partial<ToDo>) {
    super(data);
  }
}

export type ToDoWithRelations = ToDo;
