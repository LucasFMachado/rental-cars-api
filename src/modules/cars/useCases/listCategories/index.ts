import { CategoriesRepository } from '../../repositories/CategoriesRepository';
import { ListCategoriesController } from './ListCategoriesController';
import { ListCategoriesService } from './ListCategoriesService';

const categoriesRepository = null

const listCategoriesService = new ListCategoriesService(categoriesRepository);

const listCategoriesController = new ListCategoriesController(
  listCategoriesService,
);

export { listCategoriesController };
