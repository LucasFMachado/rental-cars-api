import { CategoriesRepository } from '../../repositories/CategoriesRepository';
import { ImportCategoryController } from './ImportCategoryController';
import { ImportCategoryService } from './ImportCategoryService';

const categoriesRepository = null

const importCategoryService = new ImportCategoryService(categoriesRepository);

const importCategoryController = new ImportCategoryController(
  importCategoryService,
);

export { importCategoryController };
