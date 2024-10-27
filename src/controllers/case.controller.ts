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
import {CaseRepository, PatientHistoryRepository} from '../repositories';
import {getCaseHTML} from '../utils';
import {SecurityBindings, UserProfile} from '@loopback/security';
import {inject} from '@loopback/core';
import {authenticate} from '@loopback/authentication';
import {UserRepository} from '@loopback/authentication-jwt';
@authenticate('jwt')
export class CaseController {
  constructor(
    @repository(CaseRepository)
    public caseRepository: CaseRepository,
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(PatientHistoryRepository)
    public patientHistoryRepository: PatientHistoryRepository,
    @inject(SecurityBindings.USER, {optional: true})
    public user: UserProfile,
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
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
    newCase: Omit<Case, 'id'>,
  ): Promise<any> {
    const userProfile = await this.userRepository.findOne({
      where: {
        id: currentUserProfile.id,
      },
    });
    const _newCase = await this.caseRepository.create(newCase);
    const filter = {
      where: {
        id: _newCase.id,
      },
      include: [
        {
          relation: 'patient',
        },
        {
          relation: 'user',
        },
        {
          relation: 'scan',
          order: 'id DESC',
          scope: {
            include: [
              {
                relation: 'user',
              },
            ],
          },
        },
      ],
    };
    const _case = await this.caseRepository.findOne(filter);
    await this.sendCaseEmail(_case, userProfile);
    await this.patientHistoryRepository.create({
      details: 'New Patient Added',
      actionDate: new Date().toString(),
      actionType: 'CASE',
      caseId: _case?.id,
      patientId: _case?.patientId,
      userId: _case?.userId,
    });
    return _case;
  }

  @get('/cases/count')
  @response(200, {
    description: 'Case model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Case) where?: Where<Case>): Promise<Count> {
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
  async find(@param.filter(Case) filter?: Filter<Case>): Promise<Case[]> {
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
    @param.filter(Case, {exclude: 'where'}) filter?: FilterExcludingWhere<Case>,
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
    const patient: any = await this.caseRepository.findOne({
      where: {
        id: newCase.id,
      },
    });
    await this.patientHistoryRepository.create({
      details: 'Patient Updated',
      actionDate: new Date().toString(),
      actionType: 'CASE',
      caseId: newCase?.id,
      patientId: patient?.patientId,
      userId: this.user.id,
    });
    await this.caseRepository.updateById(id, newCase);
  }


  @patch('/cases/stage/{id}')
  @response(204, {
    description: 'Case Stage Update success',
  })
  async updateCaseStageById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Case, {partial: true}),
        },
      },
    })
    newCase: any,
  ): Promise<void> {
    const patient: any = await this.caseRepository.findOne({
      where: {
        id: newCase.id,
      },
    });
    await this.patientHistoryRepository.create({
      details: newCase.details,
      actionDate: new Date().toString(),
      actionType: 'CASE',
      caseId: newCase?.id,
      patientId: patient?.patientId,
      userId: this.user.id,
    });
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
    const _case: any = await this.caseRepository.findOne({
      where: {
        id: id,
      },
      include: [
        {
          relation: 'patient',
        },
        {
          relation: 'user',
        },
      ],
    });
    await this.patientHistoryRepository.create({
      details: 'Patient/Case Removed',
      actionDate: new Date().toString(),
      actionType: 'CASE',
      caseId: _case?.id,
      patientId: _case?.patient?.id,
      userId: this.user.id,
    });
    await this.caseRepository.updateById(id, {deleted: true});
  }

  async sendCaseEmail(_case: any, profile?: any): Promise<void> {
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
      to:
        profile?.role === 'admin' && _case.userId != profile.id
          ? _case?.user?.email
          : (process.env.SENDGRID_FROM_TO as string),
      from: process.env.SENDGRID_FROM_EMAIL as string,
      subject: 'A New Case is Registered',
      text: 'Case Registration',
      html: getCaseHTML(_case),
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
