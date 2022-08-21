import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';
import { SpecificationsRepositoryInMemory } from '@modules/cars/repositories/in-memory/SpecificationsRepositoryInMemory';
import { AppError } from '@shared/errors/AppError';

import { CreateCarSpecificationsService } from './CreateCarSpecificationsService';

let createCarSpecificationsService: CreateCarSpecificationsService;
let carsRepository: CarsRepositoryInMemory;
let specificationsRepository: SpecificationsRepositoryInMemory;

describe('Create car specification', () => {
  beforeEach(() => {
    carsRepository = new CarsRepositoryInMemory();
    specificationsRepository = new SpecificationsRepositoryInMemory();
    createCarSpecificationsService = new CreateCarSpecificationsService(
      carsRepository,
      specificationsRepository,
    );
  });

  it('Should be able to link a specification to the car', async () => {
    const car = await carsRepository.create({
      name: 'Car name',
      description: 'Car description',
      daily_rate: 100,
      license_plate: 'ABC-1234',
      fine_amount: 60,
      brand: 'Car brand',
      category_id: 'Category id',
    });

    const specification = await specificationsRepository.create({
      name: 'Specification name',
      description: 'Specification description',
    });

    const specifications_id = [specification.id];

    const specificationsCars = await createCarSpecificationsService.execute({
      car_id: car.id,
      specifications_id,
    });

    expect(specificationsCars).toHaveProperty('specifications');
    expect(specificationsCars.specifications.length).toBe(1);
  });

  it('Should not be able to link a specification to not existent car', async () => {
    const car_id = '1234';
    const specifications_id = ['123', '456'];

    await expect(
      createCarSpecificationsService.execute({ car_id, specifications_id }),
    ).rejects.toEqual(new AppError('Car does not exists!'));
  });
});
