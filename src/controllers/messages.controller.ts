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
import {Messages} from '../models';
import {CaseRepository, MessagesRepository, PatientHistoryRepository} from '../repositories';
import { inject } from '@loopback/core';
import { SecurityBindings, UserProfile } from '@loopback/security';
import { authenticate } from '@loopback/authentication';

@authenticate('jwt')
export class MessagesController {
  constructor(
    @repository(MessagesRepository)
    public messagesRepository : MessagesRepository,
    @repository(CaseRepository)
    public caseRepository : CaseRepository,
    @inject(SecurityBindings.USER, { optional: true })
    public user: UserProfile,
    @repository(PatientHistoryRepository)
    public patientHistoryRepository: PatientHistoryRepository,
  ) {}

  @post('/messages')
  @response(200, {
    description: 'Messages model instance',
    content: {'application/json': {schema: getModelSchemaRef(Messages)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Messages, {
            title: 'NewMessages',
            exclude: ['id'],
          }),
        },
      },
    })
    messages: Omit<Messages, 'id'>,
  ): Promise<Messages> {
    await this.patientHistoryRepository.create({
      details: 'New Message Recieved in Stage ' + messages.stage,
      actionDate: new Date().toString(),
      actionType: 'MESSAGE',
      caseId: messages?.caseId,
      userId: this.user?.id
    });
    const now = new Date();
    messages.created_at = new Date(now.getTime() + (now.getTimezoneOffset() * 60000));
    const _case = await this.caseRepository.findById(messages?.caseId);
    if (_case) {
      _case.updated_by = this.user.id;
      _case.isViewedByAdmin = false;
      _case.isViewedByDoctor = false;
      if (this.user.id != '6d101073-fd60-4d26-ac1a-5ca5206d83d2') {
        _case.updated_at = new Date();
        _case.isViewedByDoctor = true;
        await this.caseRepository.save(_case);
      } else {
        _case.updated_at2 = new Date();
        _case.isViewedByAdmin = true;
        await this.caseRepository.save(_case);
      }
    }
    return this.messagesRepository.create(messages);
  }

  @get('/messages/count')
  @response(200, {
    description: 'Messages model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Messages) where?: Where<Messages>,
  ): Promise<Count> {
    return this.messagesRepository.count(where);
  }

  @get('/messages')
  @response(200, {
    description: 'Array of Messages model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Messages, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Messages) filter?: Filter<Messages>,
  ): Promise<Messages[]> {
    return this.messagesRepository.find(filter);
  }

  @patch('/messages')
  @response(200, {
    description: 'Messages PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Messages, {partial: true}),
        },
      },
    })
    messages: Messages,
    @param.where(Messages) where?: Where<Messages>,
  ): Promise<Count> {
    return this.messagesRepository.updateAll(messages, where);
  }

  @get('/messages/{id}')
  @response(200, {
    description: 'Messages model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Messages, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Messages, {exclude: 'where'}) filter?: FilterExcludingWhere<Messages>
  ): Promise<Messages> {
    return this.messagesRepository.findById(id, filter);
  }

  @patch('/messages/{id}')
  @response(204, {
    description: 'Messages PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Messages, {partial: true}),
        },
      },
    })
    messages: Messages,
  ): Promise<void> {
    await this.messagesRepository.updateById(id, messages);
  }

  @put('/messages/{id}')
  @response(204, {
    description: 'Messages PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() messages: Messages,
  ): Promise<void> {
    await this.messagesRepository.replaceById(id, messages);
  }

  @del('/messages/{id}')
  @response(204, {
    description: 'Messages DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.messagesRepository.deleteById(id);
  }
}
