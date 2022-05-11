import { Category } from '../../models/Category';
import { ICategoriesRepository } from '../../repositories/interfaces/ICategoriesRepository';

class ListCategoriesService {
  constructor(private categoriesRepository: ICategoriesRepository) {}

  execute(): Array<Category> {
    const allCategories = this.categoriesRepository.list();

    return allCategories;
  }
}

export { ListCategoriesService };
