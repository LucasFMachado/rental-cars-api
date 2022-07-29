import { getRepository, Repository } from 'typeorm';

import { ICarImagesRepository } from '@modules/cars/repositories/interfaces/ICarImagesRepository';

import { CarImage } from '../entities/CarImage';

class CarImagesRepository implements ICarImagesRepository {
  private repository: Repository<CarImage>;

  constructor() {
    this.repository = getRepository(CarImage);
  }

  async create(car_id: string, name: string): Promise<CarImage> {
    const carImage = this.repository.create({ car_id, name });

    await this.repository.save(carImage);

    return carImage;
  }
}

export { CarImagesRepository };
