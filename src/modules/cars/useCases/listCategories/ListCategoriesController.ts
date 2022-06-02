import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { ListCategoriesService } from './ListCategoriesService';

class ListCategoriesController {
  async handle(request: Request, response: Response): Promise<Response> {

    const listCategoriesService = container.resolve(ListCategoriesService)

    const allCategories = await listCategoriesService.execute();

    return response.json(allCategories);
  }
}

export { ListCategoriesController };
