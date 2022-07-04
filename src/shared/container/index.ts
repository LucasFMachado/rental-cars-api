import { container } from 'tsyringe'
import { CategoriesRepository } from '../../modules/cars/repositories/CategoriesRepository'
import { ICategoriesRepository } from '../../modules/cars/repositories/interfaces/ICategoriesRepository'
import { SpecificationsRepository } from '../../modules/cars/repositories/SpecificationsRepository'
import { ISpecificationsRepository } from '../../modules/cars/repositories/interfaces/ISpecificationsRepository'
import { UsersRepository } from '../../modules/accounts/repositories/UsersRepository'
import { IUsersRepository } from '../../modules/accounts/repositories/interfaces/IUsersRepository'

container.registerSingleton<ICategoriesRepository>(
  "CategoriesRepository",
  CategoriesRepository
)

container.registerSingleton<ISpecificationsRepository>(
  "SpecificationsRepository",
  SpecificationsRepository
)

container.registerSingleton<IUsersRepository>(
  "UsersRepository",
  UsersRepository
)