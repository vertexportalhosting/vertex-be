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
import {ScanRepository} from '../repositories';
import {inject} from '@loopback/core';
import bucket from '../initialize-firebase';
import multer from 'multer';
import fs from 'fs';

const upload = multer({dest: 'uploads/'});

export class ScanController {
  constructor(
    @repository(ScanRepository)
    public scanRepository: ScanRepository,
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
    await this.scanRepository.replaceById(id, scans);
  }

  @del('/scans/{id}')
  @response(204, {
    description: 'Scan DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
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
          if (file.size > 1000e5) {
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