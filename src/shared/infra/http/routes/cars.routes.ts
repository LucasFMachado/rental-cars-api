import { Router } from 'express';

import { CreateCarController } from '@modules/cars/useCases/createCar/CreateCarController';
import { CreateCarSpecificationsController } from '@modules/cars/useCases/createCarSpecifications/CreateCarSpecificationsController';
import { ListAvailableCarsController } from '@modules/cars/useCases/listAvailableCars/ListAvailableCarsController';

import { ensureAdmin } from '../middlewares/ensureAdmin';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';

const carsRoutes = Router();
const createCarController = new CreateCarController();
const listAvailableCarsController = new ListAvailableCarsController();
const createCarSpecificationsController =
  new CreateCarSpecificationsController();

carsRoutes.post(
  '/',
  ensureAuthenticated,
  ensureAdmin,
  createCarController.handle,
);

carsRoutes.get('/', listAvailableCarsController.handle);

carsRoutes.post(
  '/specifications/:id',
  ensureAuthenticated,
  ensureAdmin,
  createCarSpecificationsController.handle,
);

export { carsRoutes };
