import { Entity, model, property, belongsTo } from '@loopback/repository';
import { Patient } from './patient.model';
import { User } from './user.model';
import { Case } from './case.model';

@model()
export class Scan extends Entity {
  @property({
    id: true,
    generated: true,
    type: 'number'
  })
  id?: any;

  @property({
    type: 'string',
    required: true,
    mysql: {
      dataType: 'LONGTEXT',
    },
  })
  url: string;

  @property({
    type: 'string',
  })
  filename: string;

  @property({
    type: 'date',
    required: true,
  })
  uploadDate: string;

  // can be 0,1,2,3
  @property({
    type: 'number',
  })
  stage: number;

  @belongsTo(() => Patient)
  patientId: number;

  @belongsTo(() => User)
  userId: string;

  @belongsTo(() => Case)
  caseId: number;

  constructor(data?: Partial<Scan>) {
    super(data);
  }
}

export interface ScanRelations {
  patientId: Patient;
  userId: User;
  caseId: Case;
}

export type ScanWithRelations = Scan & ScanRelations;
