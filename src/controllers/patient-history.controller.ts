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
import {PatientHistory} from '../models';
import {PatientHistoryRepository} from '../repositories';
import { authenticate } from '@loopback/authentication';
@authenticate('jwt')
export class PatientHistoryController {
  constructor(
    @repository(PatientHistoryRepository)
    public patientHistoryRepository : PatientHistoryRepository,
  ) {}

  @post('/patient-histories')
  @response(200, {
    description: 'PatientHistory model instance',
    content: {'application/json': {schema: getModelSchemaRef(PatientHistory)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PatientHistory, {
            title: 'NewPatientHistory',
            
          }),
        },
      },
    })
    patientHistory: PatientHistory,
  ): Promise<PatientHistory> {
    return this.patientHistoryRepository.create(patientHistory);
  }

  @get('/patient-histories/count')
  @response(200, {
    description: 'PatientHistory model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(PatientHistory) where?: Where<PatientHistory>,
  ): Promise<Count> {
    return this.patientHistoryRepository.count(where);
  }

  @get('/patient-histories')
  @response(200, {
    description: 'Array of PatientHistory model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(PatientHistory, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(PatientHistory) filter?: Filter<PatientHistory>,
  ): Promise<PatientHistory[]> {
    return this.patientHistoryRepository.find(filter);
  }

  @patch('/patient-histories')
  @response(200, {
    description: 'PatientHistory PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PatientHistory, {partial: true}),
        },
      },
    })
    patientHistory: PatientHistory,
    @param.where(PatientHistory) where?: Where<PatientHistory>,
  ): Promise<Count> {
    return this.patientHistoryRepository.updateAll(patientHistory, where);
  }

  @get('/patient-histories/{id}')
  @response(200, {
    description: 'PatientHistory model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(PatientHistory, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(PatientHistory, {exclude: 'where'}) filter?: FilterExcludingWhere<PatientHistory>
  ): Promise<PatientHistory> {
    return this.patientHistoryRepository.findById(id, filter);
  }

  @patch('/patient-histories/{id}')
  @response(204, {
    description: 'PatientHistory PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PatientHistory, {partial: true}),
        },
      },
    })
    patientHistory: PatientHistory,
  ): Promise<void> {
    await this.patientHistoryRepository.updateById(id, patientHistory);
  }

  @put('/patient-histories/{id}')
  @response(204, {
    description: 'PatientHistory PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() patientHistory: PatientHistory,
  ): Promise<void> {
    await this.patientHistoryRepository.replaceById(id, patientHistory);
  }

  @del('/patient-histories/{id}')
  @response(204, {
    description: 'PatientHistory DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.patientHistoryRepository.deleteById(id);
  }
}
