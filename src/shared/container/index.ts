import { container } from 'tsyringe'
import { CategoriesRepository } from '../../modules/cars/repositories/CategoriesRepository'
import { ICategoriesRepository } from '../../modules/cars/repositories/interfaces/ICategoriesRepository'
import { SpecificationsRepository } from '../../modules/cars/repositories/SpecificationsRepository'
import { ISpecificationsRepository } from '../../modules/cars/repositories/interfaces/ISpecificationsRepository'

container.registerSingleton<ICategoriesRepository>(
  "CategoriesRepository",
  CategoriesRepository
)

container.registerSingleton<ISpecificationsRepository>(
  "SpecificationsRepository",
  SpecificationsRepository
)