import { Specification } from '../models/Specification';

interface ICreateCSpecificationDTO {
  name: string;
  description: string;
}

interface ISpecificationsRepository {
  create({ name, description }: ICreateCSpecificationDTO): void;
  // list(): Array<Specification>;
  findByName(name: string): Specification;
}

export { ISpecificationsRepository, ICreateCSpecificationDTO };
