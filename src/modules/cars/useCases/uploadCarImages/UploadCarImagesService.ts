import { inject, injectable } from 'tsyringe';

import { ICarImagesRepository } from '@modules/cars/repositories/interfaces/ICarImagesRepository';

interface IUploadCarImagesRequest {
  car_id: string;
  image_names: string[];
}

@injectable()
class UploadCarImagesService {
  constructor(
    @inject('CarImagesRepository')
    private carImagesRepository: ICarImagesRepository,
  ) {}

  async execute({
    car_id,
    image_names,
  }: IUploadCarImagesRequest): Promise<void> {
    image_names.map(async (image_name) => {
      await this.carImagesRepository.create(car_id, image_name);
    });
  }
}

export { UploadCarImagesService };
