import { inject, injectable } from 'tsyringe';

import { Car } from '@modules/cars/infra/typeorm/entities/Car';
import { ICarsRepository } from '@modules/cars/repositories/interfaces/ICarsRepository';
import { ISpecificationsRepository } from '@modules/cars/repositories/interfaces/ISpecificationsRepository';
import { AppError } from '@shared/errors/AppError';

interface ICreateCarSpecificationRequest {
  car_id: string;
  specifications_id: string[];
}

@injectable()
class CreateCarSpecificationsService {
  constructor(
    @inject('CarsRepository')
    private carsRepository: ICarsRepository,
    @inject('SpecificationsRepository')
    private specificationsRepository: ISpecificationsRepository,
  ) {}

  async execute({
    car_id,
    specifications_id,
  }: ICreateCarSpecificationRequest): Promise<Car> {
    const car = await this.carsRepository.findById(car_id);

    if (!car) {
      throw new AppError('Car does not exists!');
    }

    const specifications = await this.specificationsRepository.findByIds(
      specifications_id,
    );

    car.specifications = specifications;

    await this.carsRepository.create(car);

    return car;
  }
}

export { CreateCarSpecificationsService };
