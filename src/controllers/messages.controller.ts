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
import {
  CaseRepository,
  MessagesRepository,
  PatientHistoryRepository,
  UserRepository,
} from '../repositories';
import {inject} from '@loopback/core';
import {SecurityBindings, UserProfile} from '@loopback/security';
import {authenticate} from '@loopback/authentication';
import {getMessageNotificationHTML} from '../utils';

@authenticate('jwt')
export class MessagesController {
  constructor(
    @repository(MessagesRepository)
    public messagesRepository: MessagesRepository,
    @repository(CaseRepository)
    public caseRepository: CaseRepository,
    @inject(SecurityBindings.USER, {optional: true})
    public user: UserProfile,
    @repository(PatientHistoryRepository)
    public patientHistoryRepository: PatientHistoryRepository,
     @repository(UserRepository)
    public userRepository: UserRepository,
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
      userId: this.user?.id,
    });
    messages.created_at = new Date().toISOString();
    const _case = await this.caseRepository.findById(messages?.caseId);
    if (_case) {
      _case.updated_by = this.user.id;
      _case.isViewedByAdmin = false;
      _case.isViewedByDoctor = false;
      if (this.user.id != '6d101073-fd60-4d26-ac1a-5ca5206d83d2') {
        _case.updated_at = new Date().toISOString();
        _case.isViewedByDoctor = true;
        await this.caseRepository.save(_case);
      } else {
        _case.updated_at2 = new Date().toISOString();
        _case.isViewedByAdmin = true;
        await this.caseRepository.save(_case);
      }

      const sender = await this.userRepository.findById(this.user.id);
      let recipientId: string;

      if (this.user.id != '6d101073-fd60-4d26-ac1a-5ca5206d83d2') {
        // sender is doctor, recipient is admin
        recipientId = '6d101073-fd60-4d26-ac1a-5ca5206d83d2';
      } else {
        // sender is admin, recipient is doctor from case
        recipientId = _case.userId;
      }

      const recipient = await this.userRepository.findById(recipientId);

      const html = getMessageNotificationHTML({
        sender,
        recipient,
        message: messages.message,
        stage: messages.stage,
        caseId: messages.caseId,
        patientName: _case.patient_name || 'N/A',
      });

      // Send email notification to recipient
      await this.sendEmail(html, recipient.email);
    }
    return this.messagesRepository.create(messages);
  }

  @get('/messages/count')
  @response(200, {
    description: 'Messages model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Messages) where?: Where<Messages>): Promise<Count> {
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
    @param.filter(Messages, {exclude: 'where'})
    filter?: FilterExcludingWhere<Messages>,
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

    async sendEmail(template:any, emailTo: string): Promise<void> {
      const sgMail = require('@sendgrid/mail');
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  
      const msg = {
        to: emailTo as string,
        from: process.env.SENDGRID_FROM_EMAIL as string,
        subject: 'Notification',
        text: 'New Message Notification',
        html: template
      };
  
      try {
        await sgMail.send(msg);
        console.log('Email sent successfully');
      } catch (error) {
        console.error('Error sending email:', error);
        throw new Error(error);
      }
    }
}


