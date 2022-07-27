import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';
import { AppError } from '@shared/errors/AppError';

import { CreateCarService } from './CreateCarService';

let createCarService: CreateCarService;
let carsRepository: CarsRepositoryInMemory;

describe('Create car', () => {
  beforeEach(() => {
    carsRepository = new CarsRepositoryInMemory();
    createCarService = new CreateCarService(carsRepository);
  });

  it('Should be able to create a new car', async () => {
    const car = await createCarService.execute({
      name: 'Car name',
      description: 'Car description',
      daily_rate: 100,
      license_plate: 'ABC-1234',
      fine_amount: 60,
      brand: 'Car brand',
      category_id: 'Category id',
    });

    expect(car).toHaveProperty('id');
  });

  it('Should not be able to create a car with existent license plate', async () => {
    await createCarService.execute({
      name: 'Car name 1',
      description: 'Car description',
      daily_rate: 100,
      license_plate: 'ABC-1234',
      fine_amount: 60,
      brand: 'Car brand',
      category_id: 'Category id',
    });

    await expect(
      createCarService.execute({
        name: 'Car name 2',
        description: 'Car description',
        daily_rate: 100,
        license_plate: 'ABC-1234',
        fine_amount: 60,
        brand: 'Car brand',
        category_id: 'Category id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to create a car with available true by default', async () => {
    const car = await createCarService.execute({
      name: 'Car available',
      description: 'Car description',
      daily_rate: 100,
      license_plate: 'ABC-9876',
      fine_amount: 60,
      brand: 'Car brand',
      category_id: 'Category id',
    });

    await expect(car.available).toBe(true);
  });
});
