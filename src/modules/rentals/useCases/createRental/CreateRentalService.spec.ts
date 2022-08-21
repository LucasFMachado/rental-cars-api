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
  const validExpectedReturnDate = dayjs().add(2, 'day').toDate();
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
    const car = await carsRepository.create({
      name: 'Car test 1',
      description: 'Car test',
      daily_rate: 100,
      license_plate: 'TST1111',
      fine_amount: 40,
      brand: 'Brand test',
      category_id: 'category_id',
    });

    const rental = await createRentalService.execute({
      car_id: car.id,
      user_id: '12345',
      expected_return_date: validExpectedReturnDate,
    });

    expect(rental).toHaveProperty('id');
    expect(rental).toHaveProperty('start_date');
  });

  it('Should not be able to create a new rental for a unavailable car', async () => {
    const car = await carsRepository.create({
      name: 'Car test 2',
      description: 'Car test',
      daily_rate: 100,
      license_plate: 'TST2222',
      fine_amount: 40,
      brand: 'Brand test',
      category_id: 'category_id',
    });

    await createRentalService.execute({
      car_id: car.id,
      user_id: '00000',
      expected_return_date: validExpectedReturnDate,
    });

    await expect(
      createRentalService.execute({
        car_id: car.id,
        user_id: '77777',
        expected_return_date: validExpectedReturnDate,
      }),
    ).rejects.toEqual(new AppError('Car is not available!'));
  });

  it('Should not be able to create a new rental for a unavailable user', async () => {
    await rentalsRepository.create({
      car_id: '55555',
      user_id: '99999',
      expected_return_date: validExpectedReturnDate,
    });

    await expect(
      createRentalService.execute({
        car_id: '88888',
        user_id: '99999',
        expected_return_date: validExpectedReturnDate,
      }),
    ).rejects.toEqual(
      new AppError('There is a rental in progress to selected user!'),
    );
  });

  it('Should not be able to create a new rental with invalid return date', async () => {
    await expect(
      createRentalService.execute({
        car_id: '555',
        user_id: '444',
        expected_return_date: invalidExpectedReturnDate,
      }),
    ).rejects.toEqual(
      new AppError(
        'Invalid return expected date! Must be more or equal than 24 hours!',
      ),
    );
  });
});
