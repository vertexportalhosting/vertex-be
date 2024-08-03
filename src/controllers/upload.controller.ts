import {
    post,
    Request,
    requestBody,
    Response,
    RestBindings,
  } from '@loopback/rest';
  import {inject} from '@loopback/core';
  import multer from 'multer';
  import fs from 'fs';
  import bucket from '../initialize-firebase';
  
  const upload = multer({dest: 'uploads/'});
  
  export class FileUploadController {
    constructor() {}
  
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
          if(!file) return
          const filePath:any = `uploads/${file.filename}`;
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
            console.log('err: ', err);
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
  
    const fileTypes:any = ['jpeg', 'jpg', 'png'];
    destination = destination.includes(fileTypes)
      ? destination
      : `${destination}.${file.mimetype.split('/')[1]}`;
  
    return {filePath, destination};
  }
  