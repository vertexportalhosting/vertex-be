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
import {Case} from '../models';
import {CaseRepository} from '../repositories';

export class CaseController {
  constructor(
    @repository(CaseRepository)
    public caseRepository : CaseRepository,
  ) {}

  @post('/cases')
  @response(200, {
    description: 'Case model instance',
    content: {'application/json': {schema: getModelSchemaRef(Case)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Case, {
            title: 'NewCase',
            exclude: ['id'],
          }),
        },
      },
    })
    newCase: Omit<Case, 'id'>,
  ): Promise<Case> {
    return this.caseRepository.create(newCase);
  }

  @get('/cases/count')
  @response(200, {
    description: 'Case model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Case) where?: Where<Case>,
  ): Promise<Count> {
    return this.caseRepository.count(where);
  }

  @get('/cases')
  @response(200, {
    description: 'Array of Case model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Case, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Case) filter?: Filter<Case>,
  ): Promise<Case[]> {
    return this.caseRepository.find(filter);
  }

  @patch('/cases')
  @response(200, {
    description: 'Case PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Case, {partial: true}),
        },
      },
    })
    newCase: Case,
    @param.where(Case) where?: Where<Case>,
  ): Promise<Count> {
    return this.caseRepository.updateAll(newCase, where);
  }

  @get('/cases/{id}')
  @response(200, {
    description: 'Case model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Case, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Case, {exclude: 'where'}) filter?: FilterExcludingWhere<Case>
  ): Promise<Case> {
    return this.caseRepository.findById(id, filter);
  }

  @patch('/cases/{id}')
  @response(204, {
    description: 'Case PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Case, {partial: true}),
        },
      },
    })
    newCase: Case,
  ): Promise<void> {
    await this.caseRepository.updateById(id, newCase);
  }

  @put('/cases/{id}')
  @response(204, {
    description: 'Case PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() newCase: Case,
  ): Promise<void> {
    await this.caseRepository.replaceById(id, newCase);
  }

  @del('/cases/{id}')
  @response(204, {
    description: 'Case DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.caseRepository.deleteById(id);
  }
}
