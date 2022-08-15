import { inject, injectable } from 'tsyringe';

import { ICarsRepository } from '@modules/cars/repositories/interfaces/ICarsRepository';
import { Rental } from '@modules/rentals/infra/typeorm/entities/Rental';
import { IRentalsRepository } from '@modules/rentals/repositories/interfaces/IRentalsRepository';
import { IDateProvider } from '@shared/container/providers/DateProvider/interfaces/IDateProvider';
import { AppError } from '@shared/errors/AppError';

interface ICreateRentalRequest {
  car_id: string;
  user_id: string;
  expected_return_date: Date;
}

@injectable()
class CreateRentalService {
  constructor(
    @inject('RentalsRepository')
    private rentalsRepository: IRentalsRepository,
    @inject('DateProvider')
    private dateProvider: IDateProvider,
    @inject('CarsRepository')
    private carsRepository: ICarsRepository,
  ) {}

  async execute({
    car_id,
    user_id,
    expected_return_date,
  }: ICreateRentalRequest): Promise<Rental> {
    const minimumHours = 24;

    const carUnavailable = await this.rentalsRepository.findOpenRentalByCar(
      car_id,
    );

    if (carUnavailable) {
      throw new AppError('Car is not available!');
    }

    const userUnavailable = await this.rentalsRepository.findOpenRentalByUser(
      user_id,
    );

    if (userUnavailable) {
      throw new AppError('There is a rental in progress to selected user!');
    }

    const dateNow = this.dateProvider.getDateNow();
    const compare = this.dateProvider.comapreInHours(
      dateNow,
      expected_return_date,
    );

    if (compare < minimumHours) {
      throw new AppError(
        'Invalid return expected date! Must be more or equal than 24 hours!',
      );
    }

    const rental = await this.rentalsRepository.create({
      car_id,
      user_id,
      expected_return_date,
    });

    await this.carsRepository.updateAvailable(car_id, false);

    return rental;
  }
}

export { CreateRentalService };
