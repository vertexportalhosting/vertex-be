

import { Entity, model, property, hasOne, belongsTo, hasMany } from '@loopback/repository';
import { Patient } from './patient.model';
import { User } from './user.model';
import { Scan } from './scans.model';
import { PatientHistory } from './patient-history.model';
import { Messages } from './messages.model';

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

  @property({
    type: 'string',
    mysql: {
      dataType: 'VARCHAR',
      dataLength: 255
    }
  })
  updated_at?: String;

  @property({
    type: 'string',
    mysql: {
      dataType: 'VARCHAR',
      dataLength: 255
    }
  })
  created_at?: String;

  @property({
    type: 'string',
  })
  updated_by?: string;

  @property({
    type: 'string',
  })
  created_by?: string;

  @property({
    type: 'string',
  })
  patient_name?: string;

  @property({
    type: 'string',
  })
  doctor_name?: string;

  @property({
    type: 'boolean',
    default: false,
  })
  isViewedByDoctor?: boolean;

  @property({
    type: 'boolean',
    default: false,
  })
  isViewedByAdmin?: boolean;

  @property({
    type: 'string',
    mysql: {
      dataType: 'VARCHAR',
      dataLength: 255
    }
  })
  updated_at2?: String;

  @property({
    type: 'string',
    mysql: {
      dataType: 'VARCHAR',
      dataLength: 255
    }
  })
  delivery_date_stage_0: String;

  @property({
    type: 'string',
    mysql: {
      dataType: 'VARCHAR',
      dataLength: 255
    }
  })
  delivery_date_stage_1: String;

  @property({
    type: 'string',
    mysql: {
      dataType: 'VARCHAR',
      dataLength: 255
    }
  })
  delivery_date_stage_2: String;

  @property({
    type: 'string',
    mysql: {
      dataType: 'VARCHAR',
      dataLength: 255
    }
  })
  delivery_date_stage_3: String;

  @property({
   type: 'number',
   mysql: {
      dataType: 'BIGINT',
    }
  })
  qr_scan_count: number;

  @belongsTo(() => Patient)
  patientId: number;

  @belongsTo(() => User)
  userId: string;

  @hasMany(() => Scan)
  scan: Scan[];

  @hasMany(() => PatientHistory, {keyTo: 'caseId', keyFrom: 'id'})
  history: PatientHistory[];

  @hasMany(() => Messages, {keyTo: 'case_id'})
  messages: Messages[];

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
