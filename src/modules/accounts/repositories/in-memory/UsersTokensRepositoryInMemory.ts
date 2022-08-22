import { ICreateUserTokenDTO } from '@modules/accounts/dtos/ICreateUserTokenDTO';
import { UserToken } from '@modules/accounts/infra/typeorm/entities/UserToken';

import { IUsersTokensRepository } from '../interfaces/IUsersTokensRepository';

class UsersTokensRepositoryInMemory implements IUsersTokensRepository {
  private usersTokens: UserToken[] = [];

  async create({
    user_id,
    expiration_date,
    refresh_token,
  }: ICreateUserTokenDTO): Promise<UserToken> {
    const userToken = new UserToken();

    Object.assign(userToken, {
      user_id,
      expiration_date,
      refresh_token,
    });

    this.usersTokens.push(userToken);

    return userToken;
  }

  async deleteById(id: string): Promise<void> {
    const userTokenToDelete = this.usersTokens.find(
      (userToken) => userToken.id === id,
    );
    this.usersTokens.splice(this.usersTokens.indexOf(userTokenToDelete));
  }

  async findByUserIdAndRefreshToken(
    user_id: string,
    refresh_token: string,
  ): Promise<UserToken> {
    return this.usersTokens.find(
      (userToken) =>
        userToken.user_id === user_id &&
        userToken.refresh_token === refresh_token,
    );
  }

  async findByRefreshToken(reset_password_token: string): Promise<UserToken> {
    return this.usersTokens.find(
      (userToken) => userToken.refresh_token === reset_password_token,
    );
  }
}

export { UsersTokensRepositoryInMemory };
