// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/example-todo-jwt
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {authenticate, TokenService} from '@loopback/authentication';
import {
  Credentials,
  MyUserService,
  TokenServiceBindings,
  User,
  UserServiceBindings,
} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {model, property, repository} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  patch,
  post,
  put,
  requestBody,
  SchemaObject,
} from '@loopback/rest';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import {compare, genSalt, hash} from 'bcryptjs';
import _ from 'lodash';
import {PatientHistoryRepository, UserRepository} from '../repositories';
// import * as sgMail from '@sendgrid/mail';
import {
  getOtpTemplateHTML,
  getTemplateHTML,
  sendNewsletterTemplateHTML,
} from '../utils';

@model()
export class NewUserRequest extends User {
  @property({
    type: 'string',
    required: true,
  })
  password: string;
}

const CredentialsSchema: SchemaObject = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
    password: {
      type: 'string',
      minLength: 8,
    },
  },
};

export const CredentialsRequestBody = {
  description: 'The input of login function',
  required: true,
  content: {
    'application/json': {schema: CredentialsSchema},
  },
};

@authenticate('jwt')
export class UserController {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: MyUserService,
    @inject(SecurityBindings.USER, {optional: true})
    public user: UserProfile,
    @repository(UserRepository) protected userRepository: UserRepository,
    @repository(PatientHistoryRepository)
    public patientHistoryRepository: PatientHistoryRepository,
  ) {}

  @authenticate.skip()
  @post('/users/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async login(
    @requestBody(CredentialsRequestBody) credentials: Credentials,
  ): Promise<{token: string; role: string}> {
    const user: User | null = await this.userRepository.findOne({
      where: {
        email: credentials.email,
      },
    });
    if (!user) {
      throw HttpErrors.NotFound('User not found');
    }
    const userProfile = this.userService.convertToUserProfile(user);
    console.log('userProfile: ', userProfile);
    const passwordMatched = await compare(credentials.password, user.password);
    console.log('passwordMatched: ', passwordMatched);
    if (!passwordMatched) {
      throw new Error('Invalid password');
    }
    delete user.password;
    // create a JSON Web Token based on the user profile
    // extend token expiry
    const token = await this.jwtService.generateToken(userProfile);
    return {token, role: user.role};
  }

  @get('/whoAmI', {
    responses: {
      '200': {
        description: 'Return current user',
        content: {
          'application/json': {
            schema: {
              type: 'string',
            },
          },
        },
      },
    },
  })
  async whoAmI(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<User> {
    return await this.userService.findUserById(currentUserProfile[securityId]);
  }

  @authenticate.skip()
  @post('/signup', {
    responses: {
      '200': {
        description: 'User',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': User,
            },
          },
        },
      },
    },
  })
  async signUp(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(NewUserRequest, {
            title: 'NewUser',
          }),
        },
      },
    })
    newUserRequest: NewUserRequest,
  ): Promise<User> {
    const password = await hash(newUserRequest.password, await genSalt());
    newUserRequest.password = password;
    const savedUser = await this.userRepository.create(newUserRequest);
    await this.patientHistoryRepository.create({
      details: `New Doctor ${newUserRequest?.name} Added`,
      actionDate: new Date().toString(),
      actionType: 'DOCTOR',
      userId: savedUser.id,
    });
    await this.sendEmail(savedUser);
    return savedUser;
  }

  @authenticate.skip()
  @post('/authenticate-signup', {
    responses: {
      '200': {
        description: 'User',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': User,
            },
          },
        },
      },
    },
  })
  async authenticateSignUp(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(NewUserRequest, {
            title: 'NewUser',
          }),
        },
      },
    })
    newUserRequest: NewUserRequest,
  ): Promise<string> {
    // check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: {email: newUserRequest.email},
    });

    if (existingUser) {
      throw new HttpErrors.BadRequest('User already exists');
    }
    // generate a random 6 digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    // send email with the code
    await this.sendOtpEmail(newUserRequest, code);
    return code;
  }

  @patch('/users/{id}', {
    responses: {
      '204': {
        description: 'User PATCH success',
      },
    },
  })
  async updateUserById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: Partial<User>,
  ): Promise<void> {
    await this.patientHistoryRepository.create({
      details: `Doctor ${user?.name} Updated`,
      actionDate: new Date().toString(),
      actionType: 'DOCTOR',
      userId: this.user.id,
    });
    await this.userRepository.updateById(id, user);
  }

  @put('/users/{id}', {
    responses: {
      '204': {
        description: 'User PUT success',
      },
    },
  })
  async replaceUserById(
    @param.path.string('id') id: string,
    @requestBody() user: User,
  ): Promise<void> {
    await this.userRepository.replaceById(id, user);
  }

  @get('/users/{id}', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(User, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findUserById(@param.path.string('id') id: string): Promise<User> {
    return this.userRepository.findById(id);
  }

  @get('/users', {
    responses: {
      '200': {
        description: 'Array of User model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(User, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async findAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  @del('/users/{id}', {
    responses: {
      '204': {
        description: 'User DELETE success',
      },
    },
  })
  async deleteUserById(@param.path.string('id') id: string): Promise<void> {
    const user = await this.userRepository.findById(id);
    await this.patientHistoryRepository.create({
      details: `Doctor ${user?.username} Deleted`,
      actionDate: new Date().toString(),
      actionType: 'DOCTOR',
      userId: this.user.id,
    });
    await this.userRepository.deleteById(id);
  }

  @authenticate.skip()
  @get('/test-email', {
    responses: {
      '204': {
        description: 'Email test',
      },
    },
  })
  async testEmail(): Promise<void> {
    await this.sendEmail({username: 'Doctor', email: 'test@gmail.com'} as any);
  }

  @get('/export/users-emails', {
    responses: {
      '200': {
        description: 'Export doctor emails',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
          },
        },
      },
    },
  })
  async exportDoctorsEmails(): Promise<string[]> {
    const doctors = await this.userRepository.find({
      where: {role: 'Doctor'},
      fields: {email: true},
    });
    return _.map(doctors, 'email');
  }

  @post('/newsletter', {
    responses: {
      '200': {
        description: 'User',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': User,
            },
          },
        },
      },
    },
  })
  async sendNewsLetter(
    @requestBody({
      content: {},
      data: {},
    })
    body: any,
  ): Promise<{success: boolean}> {
    const {data, content} = body;
    if (!data || !content) {
      throw new HttpErrors.BadRequest('Data and content are required');
    }

    const users = await this.userRepository.find({
      where: {role: 'Doctor', email: {
        inq: data.emails
      }},
      fields: {email: true},
    });

    if (!users || users.length === 0) {
      throw new HttpErrors.NotFound('No doctors found');
    }

    // Send email to each doctor
    for (const user of users) {
      if (user.email) {
        data.email = user.email; // Set the email for each doctor
        await this.sendNewsLetterEmails(data, content);
      }
    }

    return {success: true};
  }

  async sendEmail(doctor: User): Promise<void> {
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
      to: process.env.SENDGRID_FROM_TO as string,
      from: process.env.SENDGRID_FROM_EMAIL as string,
      subject: 'Doctor Registration',
      text: 'Doctor Registration',
      html: getTemplateHTML(doctor),
    };

    try {
      await sgMail.send(msg);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error(error);
    }
  }

  async sendOtpEmail(data: any, otp: string): Promise<void> {
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
      to: data.email as string,
      from: process.env.SENDGRID_FROM_EMAIL as string,
      subject: 'OTP Verification',
      text: 'Verification Required',
      html: getOtpTemplateHTML(data, otp),
    };

    try {
      await sgMail.send(msg);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error(error);
    }
  }

  async sendNewsLetterEmails(data: any, content: any): Promise<void> {
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
      to: data.email as string,
      from: 'support@vertexdentalstudio.com',
      subject: data.title,
      text: data.title,
      html: sendNewsletterTemplateHTML(data, content),
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
