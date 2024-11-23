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
  Request,
  Response,
  RestBindings,
} from '@loopback/rest';
import {Scan} from '../models';
import {CaseRepository, PatientHistoryRepository, ScanRepository} from '../repositories';
import {inject} from '@loopback/core';
import bucket from '../initialize-firebase';
import multer from 'multer';
import fs from 'fs';
import { SecurityBindings, UserProfile } from '@loopback/security';
import { authenticate } from '@loopback/authentication';

const upload = multer({dest: 'uploads/'});

@authenticate('jwt')
export class ScanController {
  constructor(
    @repository(ScanRepository)
    public scanRepository: ScanRepository,
    @repository(CaseRepository)
    public caseRepository: CaseRepository,
    @repository(PatientHistoryRepository)
    public patientHistoryRepository: PatientHistoryRepository,
    @inject(SecurityBindings.USER, { optional: true })
    public user: UserProfile,
  ) {}

  @post('/scans')
  @response(200, {
    description: 'Scan model instance',
    content: {'application/json': {schema: getModelSchemaRef(Scan)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Scan, {
            title: 'NewScans',
            exclude: ['id'],
          }),
        },
      },
    })
    scans: Omit<Scan, 'id'>,
  ): Promise<Scan> {
    await this.patientHistoryRepository.create({
      details: 'New Scans Uploaded',
      actionDate: new Date().toString(),
      actionType: 'SCANS',
      caseId: scans?.caseId,
      patientId: scans?.patientId,
      userId: this.user?.id
    });
    const _case = await this.caseRepository.findById(scans?.caseId);
    if (_case) {
      _case.updated_at = new Date();
      _case.updated_by = this.user.id;
      if (this.user.id != '6d101073-fd60-4d26-ac1a-5ca5206d83d2') {
        await this.caseRepository.save(_case);
      }
    }
    return this.scanRepository.create(scans);
  }

  @get('/scans/count')
  @response(200, {
    description: 'Scan model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Scan) where?: Where<Scan>): Promise<Count> {
    return this.scanRepository.count(where);
  }

  @get('/scans')
  @response(200, {
    description: 'Array of Scan model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Scan, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(Scan) filter?: Filter<Scan>): Promise<Scan[]> {
    return this.scanRepository.find(filter);
  }

  @patch('/scans')
  @response(200, {
    description: 'Scan PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Scan, {partial: true}),
        },
      },
    })
    scans: Scan,
    @param.where(Scan) where?: Where<Scan>,
  ): Promise<Count> {
    const _case = await this.caseRepository.findById(scans.caseId);
    if (_case) {
      _case.updated_at = new Date();
      _case.updated_by = this.user.id;
      if (this.user.id != '6d101073-fd60-4d26-ac1a-5ca5206d83d2') {
        await this.caseRepository.save(_case);
      }
    }
    return this.scanRepository.updateAll(scans, where);
  }

  @get('/scans/{id}')
  @response(200, {
    description: 'Scan model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Scan, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Scan, {exclude: 'where'}) filter?: FilterExcludingWhere<Scan>,
  ): Promise<Scan> {
    return this.scanRepository.findById(id, filter);
  }

  @patch('/scans/{id}')
  @response(204, {
    description: 'Scan PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Scan, {partial: true}),
        },
      },
    })
    scans: Scan,
  ): Promise<void> {
    const _case = await this.caseRepository.findById(scans.caseId);
    if (_case) {
      _case.updated_at = new Date();
      _case.updated_by = this.user.id;
      if (this.user.id != '6d101073-fd60-4d26-ac1a-5ca5206d83d2') {
        await this.caseRepository.save(_case);
      }    
    }
    await this.scanRepository.updateById(id, scans);
  }

  @put('/scans/{id}')
  @response(204, {
    description: 'Scan PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() scans: Scan,
  ): Promise<void> {
    const _case = await this.caseRepository.findById(scans.caseId);
    if (_case) {
      _case.updated_at = new Date();
      _case.updated_by = this.user.id;
      if (this.user.id != '6d101073-fd60-4d26-ac1a-5ca5206d83d2') {
        await this.caseRepository.save(_case);
      }    }
    await this.scanRepository.replaceById(id, scans);
  }

  @del('/scans/{id}')
  @response(204, {
    description: 'Scan DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    const scans = await this.scanRepository.findById(id)
    await this.patientHistoryRepository.create({
      details: 'Scan Deleted',
      actionDate: new Date().toString(),
      actionType: 'SCANS',
      caseId: scans?.caseId,
      patientId: scans?.patientId,
      userId: this.user.id
    });
    const _case = await this.caseRepository.findById(scans.caseId);
    if (_case) {
      _case.updated_at = new Date();
      _case.updated_by = this.user.id;
      if (this.user.id != '6d101073-fd60-4d26-ac1a-5ca5206d83d2') {
        await this.caseRepository.save(_case);
      }    }
    await this.scanRepository.deleteById(id);
  }

  @post('/upload', {
    responses: {
      '200': {
        description: 'File Upload',
        content: {'application/json': {schema: {type: 'object'}}},
      },
    },
  })
  async fileUpload(
    @requestBody.file()
    request: Request,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<object> {
    return new Promise<object>((resolve, reject) => {
      upload.single('file')(request, response, async (err: any) => {
        if (err) reject(err);

        const file = request.file;
        if (!file) return;
        const filePath: any = `uploads/${file.filename}`;
        try {
          // switch (file.mimetype) {
          //   case 'image/jpeg':
          //   case 'image/png':
          //   case 'image/jpg':
          if (file.size > 1181116006) {
            return response.status(400).send({
              message: 'Image size is too large. Max 1gb',
            });
          }
          //     break;
          //   default:
          //     return response.status(400).send({
          //       message:
          //         'Invalid file type. Only jpg, jpeg and png files are allowed',
          //     });
          // }

          const destination = getUniqueFileAttr(file).destination;

          await bucket.upload(filePath, {
            destination: destination,
          });

          const fileRef = bucket.file(destination);
          const signedUrls = await fileRef.getSignedUrl({
            action: 'read',
            expires: '03-09-2030',
          });

          fs.unlinkSync(filePath);

          resolve({imageUrl: signedUrls[0]});
        } catch (err) {
          console.error('Error uploading file:', err);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
          reject(err);
        }
      });
    });
  }
}

function getUniqueFileAttr(file: any) {
  const filePath = `uploads/${file.filename}`;
  let destination = `uploads/${Date.now()}_${file.originalname}`;

  const fileTypes: any = ['jpeg', 'jpg', 'png'];
  destination = destination.includes(fileTypes)
    ? destination
    : `${destination}.${file.mimetype.split('/')[1]}`;

  return {filePath, destination};
}


// @post('/download', {
//   responses: {
//     '200': {
//       description: 'File Upload',
//       content: {'application/json': {schema: {type: 'object'}}},
//     },
//   },
// })
// async download() {

// }