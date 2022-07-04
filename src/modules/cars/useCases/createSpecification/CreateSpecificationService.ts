import { inject, injectable } from 'tsyringe';

import { ISpecificationsRepository } from '../../repositories/interfaces/ISpecificationsRepository';

interface ICreateSpecificationRequest {
  name: string;
  description: string;
}

@injectable()
class CreateSpecificationService {
  constructor(
    @inject('SpecificationsRepository')
    private specificationsRepository: ISpecificationsRepository,
  ) {}

  async execute({
    name,
    description,
  }: ICreateSpecificationRequest): Promise<void> {
    const specificationAlreadyExists =
      await this.specificationsRepository.findByName(name);

    if (specificationAlreadyExists) {
      throw new Error('Specification already exists.');
    }

    await this.specificationsRepository.create({ name, description });
  }
}

export { CreateSpecificationService };
