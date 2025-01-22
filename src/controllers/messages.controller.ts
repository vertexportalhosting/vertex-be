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
import {MessagesRepository} from '../repositories';

export class MessagesController {
  constructor(
    @repository(MessagesRepository)
    public messagesRepository : MessagesRepository,
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
