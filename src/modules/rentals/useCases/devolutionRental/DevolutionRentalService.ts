import { inject, injectable } from 'tsyringe';

import { ICarsRepository } from '@modules/cars/repositories/interfaces/ICarsRepository';
import { Rental } from '@modules/rentals/infra/typeorm/entities/Rental';
import { IRentalsRepository } from '@modules/rentals/repositories/interfaces/IRentalsRepository';
import { IDateProvider } from '@shared/container/providers/DateProvider/interfaces/IDateProvider';
import { AppError } from '@shared/errors/AppError';

interface IDevolutionRentalRequest {
  id: string;
  user_id: string;
}

@injectable()
class DevolutionRentalService {
  constructor(
    @inject('RentalsRepository')
    private rentalsRepository: IRentalsRepository,
    @inject('CarsRepository')
    private carsRepository: ICarsRepository,
    @inject('DateProvider')
    private dateProvider: IDateProvider,
  ) {}

  async execute({ id, user_id }: IDevolutionRentalRequest): Promise<Rental> {
    const minimumDaily = 1;

    const rental = await this.rentalsRepository.findById(id);
    const car = await this.carsRepository.findById(rental.car_id);

    if (!rental) {
      throw new AppError('Rental does not exists!');
    }

    const dateNow = this.dateProvider.getDateNow();

    let numberOfDays = this.dateProvider.compareInDays(
      rental.start_date,
      dateNow,
    );

    if (numberOfDays <= 0) {
      numberOfDays = minimumDaily;
    }

    const delay = this.dateProvider.compareInDays(
      dateNow,
      rental.expected_return_date,
    );

    let total = 0;
    if (delay > 0) {
      const calculateFine = delay * car.fine_amount;
      total = calculateFine;
    }

    total += numberOfDays * car.daily_rate;

    rental.end_date = this.dateProvider.getDateNow();
    rental.total = total;

    await this.rentalsRepository.create(rental);
    await this.carsRepository.updateAvailable(car.id, true);

    return rental;
  }
}

export { DevolutionRentalService };
