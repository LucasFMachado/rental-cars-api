import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { UploadCarImagesService } from './UploadCarImagesService';

interface IFiles {
  filename: string;
}

class UploadCarImagesController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const images = request.files as IFiles[];

    const uploadCarImageService = container.resolve(UploadCarImagesService);

    const image_names = images.map((image) => image.filename);

    await uploadCarImageService.execute({ car_id: id, image_names });

    return response.status(201).send();
  }
}

export { UploadCarImagesController };
