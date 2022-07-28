import { inject, injectable } from 'tsyringe';

import { Car } from '@modules/cars/infra/typeorm/entities/Car';
import { ICarsRepository } from '@modules/cars/repositories/interfaces/ICarsRepository';

interface IListAvailableCarsRequest {
  name?: string;
  brand?: string;
  category_id?: string;
}

@injectable()
class ListAvailableCarsService {
  constructor(
    @inject('CarsRepository')
    private carsRepository: ICarsRepository,
  ) {}

  async exeucte({
    name,
    brand,
    category_id,
  }: IListAvailableCarsRequest): Promise<Car[]> {
    const cars = await this.carsRepository.findAvailable(
      name,
      brand,
      category_id,
    );
    return cars;
  }
}
export { ListAvailableCarsService };
