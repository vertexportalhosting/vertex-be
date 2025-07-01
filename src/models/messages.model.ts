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
    mysql: {
      dataType: 'LONGTEXT'
    }
  })
  message: string;

  @property({
    type: 'string',
  })
  stage: string;

  @property({
    type: 'string',
    mysql: {
      dataType: 'VARCHAR',
      dataLength: 255
    }
  })
  created_at?: String;

  @property({
    type: 'boolean',
    default: false
  })
  isReadByAdmin: boolean;

  @property({
    type: 'boolean',
    default: false
  })
  isReadByDoctor: boolean

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