import { CarImage } from '@modules/cars/infra/typeorm/entities/CarImage';

interface ICarImagesRepository {
  create(car_id: string, name: string): Promise<CarImage>;
}
export { ICarImagesRepository };
