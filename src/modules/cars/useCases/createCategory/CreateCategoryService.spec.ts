import { CategoriesRepositoryInMemory } from '@modules/cars/repositories/in-memory/CategoriesRepositoryInMemory';
import { AppError } from '@shared/errors/AppError';

import { CreateCategoryService } from './CreateCategoryService';

let createCategoryService: CreateCategoryService;
let categoriesRepository: CategoriesRepositoryInMemory;

describe('Create category', () => {
  beforeEach(() => {
    categoriesRepository = new CategoriesRepositoryInMemory();
    createCategoryService = new CreateCategoryService(categoriesRepository);
  });

  it('Should be able to create a new category', async () => {
    const category = {
      name: 'Category name test',
      description: 'Category description test',
    };

    await createCategoryService.execute(category);

    const categoryCreated = await categoriesRepository.findByName(
      category.name,
    );

    expect(categoryCreated).toHaveProperty('id');
  });

  it('Should not be able to create a new category with duplicated name', async () => {
    const category = {
      name: 'Category name test',
      description: 'Category description test',
    };

    await createCategoryService.execute(category);

    await expect(createCategoryService.execute(category)).rejects.toEqual(
      new AppError('Category already exists!'),
    );
  });
});
