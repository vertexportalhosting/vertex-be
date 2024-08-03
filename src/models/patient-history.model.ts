import { Entity, model, property, belongsTo } from '@loopback/repository';
import { Patient } from './patient.model';
import { User } from './user.model';
import { Scan } from './scans.model';
import { Case } from './case.model';

@model()
export class PatientHistory extends Entity {
  @property({
    id: true,
    generated: true,
    type: 'number'
  })
  id?: any;

  @property({
    type: 'date',
    required: true,
  })
  actionDate: string;

  @property({
    type: 'string',
    required: true,
  })
  actionType: string;

  @property({
    type: 'string',
  })
  details?: string;

  @belongsTo(() => Patient)
  patientId: number;

  @belongsTo(() => User)
  userId: string;

  @belongsTo(() => Case)
  caseId: number

  constructor(data?: Partial<PatientHistory>) {
    super(data);
  }
}

export interface PatientHistoryRelations {
  patient: Patient;
  updatedBy: User;
  case: Case
}

export type PatientHistoryWithRelations = PatientHistory & PatientHistoryRelations;
