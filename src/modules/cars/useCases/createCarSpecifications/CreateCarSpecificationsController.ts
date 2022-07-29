import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateCarSpecificationsService } from './CreateCarSpecificationsService';

class CreateCarSpecificationsController {
  async handle(request: Request, response: Response) {
    const { id } = request.params;
    const { specifications_id } = request.body;

    const createCarSpecificationsService = container.resolve(
      CreateCarSpecificationsService,
    );

    const car = await createCarSpecificationsService.execute({
      car_id: id,
      specifications_id,
    });

    return response.status(201).json(car);
  }
}

export { CreateCarSpecificationsController };
