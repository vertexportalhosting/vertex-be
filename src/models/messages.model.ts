import {belongsTo, Entity, model, property} from '@loopback/repository';
import { User } from './user.model';
import { Case } from './case.model';

@model()
export class Messages extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
  })
  message: string;

  @property({
    type: 'string',
  })
  stage: string;

  @property({
    type: 'date',
    default: new Date()
  })
  created_at?: Date;

  @belongsTo(() => User)
  userId: string;

  @belongsTo(() => Case)
  caseId: number;

  constructor(data?: Partial<Messages>) {
    super(data);
  }
}

export interface MessagesRelations {
  // describe navigational properties here
}

export type MessagesWithRelations = Messages & MessagesRelations;