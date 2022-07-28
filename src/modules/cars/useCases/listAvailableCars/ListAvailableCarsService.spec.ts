import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';

import { ListAvailableCarsService } from './ListAvailableCarsService';

let listAvailableCarsService: ListAvailableCarsService;
let carsRepository: CarsRepositoryInMemory;

describe('List available cars', () => {
  beforeEach(() => {
    carsRepository = new CarsRepositoryInMemory();
    listAvailableCarsService = new ListAvailableCarsService(carsRepository);
  });

  it('Should be able to list all available cars', async () => {
    const car = await carsRepository.create({
      name: 'Car name test 1',
      description: 'Car description test',
      daily_rate: 100,
      license_plate: 'ABC-1111',
      fine_amount: 60,
      brand: 'Car brand test',
      category_id: 'category_id',
    });

    const cars = await listAvailableCarsService.exeucte({});

    expect(cars).toEqual([car]);
  });

  it('Should be able to list all available cars by name', async () => {
    const car = await carsRepository.create({
      name: 'Car name test 2',
      description: 'Car description test',
      daily_rate: 100,
      license_plate: 'ABC-1111',
      fine_amount: 60,
      brand: 'Car brand test 2',
      category_id: 'category_id',
    });

    const cars = await listAvailableCarsService.exeucte({
      name: 'Car name test 2',
    });

    expect(cars).toEqual([car]);
  });

  it('Should be able to list all available cars by brand', async () => {
    const car = await carsRepository.create({
      name: 'Car name test 3',
      description: 'Car description test',
      daily_rate: 100,
      license_plate: 'ABC-1111',
      fine_amount: 60,
      brand: 'Car brand test 3',
      category_id: 'category_id',
    });

    const cars = await listAvailableCarsService.exeucte({
      brand: 'Car brand test 3',
    });

    expect(cars).toEqual([car]);
  });

  it('Should be able to list all available cars by category', async () => {
    const car = await carsRepository.create({
      name: 'Car name test 3',
      description: 'Car description test',
      daily_rate: 100,
      license_plate: 'ABC-1111',
      fine_amount: 60,
      brand: 'Car brand test 3',
      category_id: '12345',
    });

    const cars = await listAvailableCarsService.exeucte({
      category_id: '12345',
    });

    expect(cars).toEqual([car]);
  });
});
