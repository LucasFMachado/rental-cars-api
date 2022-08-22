import { hash } from 'bcryptjs';
import { inject, injectable } from 'tsyringe';

import { IUsersRepository } from '@modules/accounts/repositories/interfaces/IUsersRepository';
import { IUsersTokensRepository } from '@modules/accounts/repositories/interfaces/IUsersTokensRepository';
import { IDateProvider } from '@shared/container/providers/DateProvider/interfaces/IDateProvider';
import { AppError } from '@shared/errors/AppError';

interface IResetPasswordUserRequest {
  reset_password_token: string;
  password: string;
}

@injectable()
class ResetPasswordUserService {
  constructor(
    @inject('UsersTokensRepository')
    private usersTokensRepository: IUsersTokensRepository,
    @inject('DateProvider')
    private dateProvider: IDateProvider,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  async execute({
    reset_password_token,
    password,
  }: IResetPasswordUserRequest): Promise<void> {
    const userToken = await this.usersTokensRepository.findByRefreshToken(
      reset_password_token,
    );

    if (!userToken) {
      throw new AppError('Reset password token is invaid!');
    }

    const isValidToken = this.dateProvider.compareIfBefore(
      userToken.expiration_date,
      this.dateProvider.getDateNow(),
    );

    if (isValidToken) {
      throw new AppError('Reset password token expired!');
    }

    const user = await this.usersRepository.findById(userToken.user_id);

    user.password = await hash(password, 8);

    await this.usersRepository.create(user);

    await this.usersTokensRepository.deleteById(userToken.id);
  }
}

export { ResetPasswordUserService };
