import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import { Patient, PatientHistory } from '../models';
import { CaseRepository, PatientHistoryRepository, PatientRepository } from '../repositories';
import { authenticate } from '@loopback/authentication';
import { inject } from '@loopback/core';
import { SecurityBindings, UserProfile } from '@loopback/security';
@authenticate('jwt')
export class PatientControllerController {
  constructor(
    @repository(PatientRepository)
    public patientRepository: PatientRepository,
    @repository(PatientHistoryRepository)
    public historyRepository: PatientHistoryRepository,
    @repository(CaseRepository)
    public caseRepository: CaseRepository,
    @inject(SecurityBindings.USER, { optional: true })
    public user: UserProfile,
  ) { }

  @post('/patients')
  @response(200, {
    description: 'Patient model instance',
    content: { 'application/json': { schema: getModelSchemaRef(Patient) } },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Patient, {
            title: 'NewPatient',
            exclude: ['id'],
          }),
        },
      },
    })
    patient: Omit<Patient, 'id'>,
  ): Promise<Patient> {
    return this.patientRepository.create(patient);
  }

  @get('/patients/count')
  @response(200, {
    description: 'Patient model count',
    content: { 'application/json': { schema: CountSchema } },
  })
  async count(
    @param.where(Patient) where?: Where<Patient>,
  ): Promise<Count> {
    return this.patientRepository.count(where);
  }

  @get('/patients')
  @response(200, {
    description: 'Array of Patient model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Patient, { includeRelations: true }),
        },
      },
    },
  })
  async find(
    @param.filter(Patient) filter?: Filter<Patient>,
  ): Promise<Patient[]> {
    return this.patientRepository.find(filter);
  }

  @patch('/patients')
  @response(200, {
    description: 'Patient PATCH success count',
    content: { 'application/json': { schema: CountSchema } },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Patient, { partial: true }),
        },
      },
    })
    patient: Patient,
    @param.where(Patient) where?: Where<Patient>,
  ): Promise<Count> {
    return this.patientRepository.updateAll(patient, where);
  }

  @get('/patients/{id}')
  @response(200, {
    description: 'Patient model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Patient, { includeRelations: true }),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Patient, { exclude: 'where' }) filter?: FilterExcludingWhere<Patient>
  ): Promise<Patient> {
    return this.patientRepository.findById(id, { ...filter, include: [{ relation: 'history' }] });
  }

  @patch('/patients/{id}')
  @response(204, {
    description: 'Patient PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Patient, { partial: true }),
        },
      },
    })
    patient: Patient,
  ): Promise<void> {
    const _case = await this.caseRepository.findOne({
      where: {
        patientId: id
      }
    });
    await this.historyRepository.create({
      details: "Patient Details Updated",
      actionDate: new Date().toString(),
      actionType: 'PATIENT',
      caseId: _case?.id,
      patientId: id,
      userId: this.user.id,
    });
    if (_case) {
      if (this.user.id != '6d101073-fd60-4d26-ac1a-5ca5206d83d2') {
        _case.updated_at = new Date();
      }
      await this.caseRepository.updateById(id, _case);
    }
    await this.patientRepository.updateById(id, patient);
  }

  @put('/patients/{id}')
  @response(204, {
    description: 'Patient PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() patient: Patient,
  ): Promise<void> {
    await this.patientRepository.replaceById(id, patient);
  }

  @del('/patients/{id}')
  @response(204, {
    description: 'Patient DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.patientRepository.deleteById(id);
  }

  @get('/patients/{id}/histories', {
    responses: {
      '200': {
        description: 'Array of Patient\'s History',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': PatientHistory } },
          },
        },
      },
    },
  })
  async getPatientHistories(
    @param.path.number('id') id: number,
  ): Promise<PatientHistory[]> {
    return this.patientRepository.patienthistory(id).find();
  }
}
