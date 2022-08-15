import dayjs from 'dayjs';

import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';
import { RentalsRepositoryInMemory } from '@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory';
import { DateProvider } from '@shared/container/providers/DateProvider/DateProvider';
import { AppError } from '@shared/errors/AppError';

import { CreateRentalService } from './CreateRentalService';

let createRentalService: CreateRentalService;
let rentalsRepository: RentalsRepositoryInMemory;
let carsRepository: CarsRepositoryInMemory;
let dateProvider: DateProvider;

describe('Create rental', () => {
  const validExpectedReturnDate = dayjs().add(1, 'day').toDate();
  const invalidExpectedReturnDate = dayjs().add(12, 'hours').toDate();

  beforeEach(() => {
    rentalsRepository = new RentalsRepositoryInMemory();
    carsRepository = new CarsRepositoryInMemory();
    dateProvider = new DateProvider();
    createRentalService = new CreateRentalService(
      rentalsRepository,
      dateProvider,
      carsRepository,
    );
  });

  it('Should be able to create a new rental for a car', async () => {
    const rental = await createRentalService.execute({
      car_id: '12345',
      user_id: '12345',
      expected_return_date: validExpectedReturnDate,
    });

    expect(rental).toHaveProperty('id');
    expect(rental).toHaveProperty('start_date');
  });

  it('Should not be able to create a new rental for a unavailable car', async () => {
    await createRentalService.execute({
      car_id: '00000',
      user_id: '00000',
      expected_return_date: validExpectedReturnDate,
    });

    await expect(
      createRentalService.execute({
        car_id: '00000',
        user_id: '77777',
        expected_return_date: validExpectedReturnDate,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to create a new rental for a unavailable user', async () => {
    await createRentalService.execute({
      car_id: '99999',
      user_id: '99999',
      expected_return_date: validExpectedReturnDate,
    });

    await expect(
      createRentalService.execute({
        car_id: '88888',
        user_id: '99999',
        expected_return_date: validExpectedReturnDate,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to create a new rental with invalid return date', async () => {
    await expect(
      createRentalService.execute({
        car_id: '555',
        user_id: '444',
        expected_return_date: invalidExpectedReturnDate,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
