import { inject, injectable } from 'tsyringe';

import { ICategoriesRepository } from '../../repositories/interfaces/ICategoriesRepository';

interface ICreateCategoryRequest {
  name: string;
  description: string;
}

@injectable()
class CreateCategoryService {
  constructor(
    @inject('CategoriesRepository')
    private categoriesRepository: ICategoriesRepository,
  ) {}

  async execute({ name, description }: ICreateCategoryRequest): Promise<void> {
    const categoryAlreadyExists = await this.categoriesRepository.findByName(
      name,
    );

    if (categoryAlreadyExists) {
      throw new Error('Category already exists.');
    }

    await this.categoriesRepository.create({ name, description });
  }
}

export { CreateCategoryService };
