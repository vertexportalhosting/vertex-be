

import { Entity, model, property, hasOne, belongsTo, hasMany } from '@loopback/repository';
import { Patient } from './patient.model';
import { User } from './user.model';
import { Scan } from './scans.model';

@model()
export class Case extends Entity {
  @property({
    id: true,
    generated: true,
    type: 'number'
  })
  id?: any;

  @property({
    type: 'string',
  })
  case_type: string;

  @property({
    type: 'string',
  })
  delivery_date: string;

  @property({
    type: 'boolean',
  })
  urgent: boolean;

  @property({
    type: 'string',
  })
  notes: string;

  @property({
    type: 'string',
  })
  case_status: string;

  @property({
    type: 'string',
  })
  payment_status: string;

  @property({
    type: 'boolean',
    default: false
  })
  deleted?: boolean;

  @property({
    type: 'boolean',
    default: false,
  })
  isStageOneComplete?: boolean;

  @property({
    type: 'boolean',
    default: false,
  })
  isStageTwoComplete?: boolean;

  @property({
    type: 'boolean',
    default: false,
  })
  isStageThreeComplete?: boolean;

  @property({
    type: 'boolean',
    default: false,
  })
  isStageFourComplete?: boolean;

  @belongsTo(() => Patient)
  patientId: number;

  @belongsTo(() => User)
  userId: string;

  @hasMany(() => Scan)
  scan: Scan[];

  constructor(data?: Partial<Case>) {
    super(data);
  }
}

export interface CaseRelations {
  userId: User;
  patientId: Patient;
  scan: Scan
}

export type CaseWithRelations = Case & CaseRelations;
