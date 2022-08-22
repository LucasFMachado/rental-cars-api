import { getRepository, Repository } from 'typeorm';

import { ICreateUserTokenDTO } from '@modules/accounts/dtos/ICreateUserTokenDTO';
import { IUsersTokensRepository } from '@modules/accounts/repositories/interfaces/IUsersTokensRepository';

import { UserToken } from '../entities/UserToken';

class UsersTokensRepository implements IUsersTokensRepository {
  private repository: Repository<UserToken>;

  constructor() {
    this.repository = getRepository(UserToken);
  }

  async create({
    refresh_token,
    user_id,
    expiration_date,
  }: ICreateUserTokenDTO): Promise<UserToken> {
    const userToken = this.repository.create({
      refresh_token,
      user_id,
      expiration_date,
    });

    await this.repository.save(userToken);

    return userToken;
  }

  async deleteById(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async findByUserIdAndRefreshToken(
    user_id: string,
    refresh_token: string,
  ): Promise<UserToken> {
    const userRefreshToken = await this.repository.findOne({
      user_id,
      refresh_token,
    });
    return userRefreshToken;
  }

  async findByRefreshToken(reset_password_token: string): Promise<UserToken> {
    const userToken = await this.repository.findOne({
      refresh_token: reset_password_token,
    });

    return userToken;
  }
}

export { UsersTokensRepository };
