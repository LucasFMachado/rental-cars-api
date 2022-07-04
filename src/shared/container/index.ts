import { container } from 'tsyringe';

import { IUsersRepository } from '../../modules/accounts/repositories/interfaces/IUsersRepository';
import { UsersRepository } from '../../modules/accounts/repositories/UsersRepository';
import { CategoriesRepository } from '../../modules/cars/repositories/CategoriesRepository';
import { ICategoriesRepository } from '../../modules/cars/repositories/interfaces/ICategoriesRepository';
import { ISpecificationsRepository } from '../../modules/cars/repositories/interfaces/ISpecificationsRepository';
import { SpecificationsRepository } from '../../modules/cars/repositories/SpecificationsRepository';

container.registerSingleton<ICategoriesRepository>(
  'CategoriesRepository',
  CategoriesRepository,
);

container.registerSingleton<ISpecificationsRepository>(
  'SpecificationsRepository',
  SpecificationsRepository,
);

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);
