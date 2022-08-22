import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

import auth from '@config/auth';
import { IUsersRepository } from '@modules/accounts/repositories/interfaces/IUsersRepository';
import { IUsersTokensRepository } from '@modules/accounts/repositories/interfaces/IUsersTokensRepository';
import { IDateProvider } from '@shared/container/providers/DateProvider/interfaces/IDateProvider';
import { AppError } from '@shared/errors/AppError';

interface IAuthenticateUserRequest {
  email: string;
  password: string;
}

interface IAuthenticateUserResponse {
  user: {
    name: string;
    email: string;
  };
  token: string;
  refresh_token: string;
}

@injectable()
class AuthenticateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('UsersTokensRepository')
    private usersTokensRepository: IUsersTokensRepository,
    @inject('DateProvider')
    private dateProvider: IDateProvider,
  ) {}

  async execute({
    email,
    password,
  }: IAuthenticateUserRequest): Promise<IAuthenticateUserResponse> {
    const {
      token_secret,
      token_expires_in,
      refresh_token_secret,
      refresh_token_expiration_days,
    } = auth;

    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Email or password incorrect!');
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new AppError('Email or password incorrect!');
    }

    const token = sign({}, token_secret, {
      subject: user.id,
      expiresIn: token_expires_in,
    });

    const refresh_token = sign({ email }, refresh_token_secret, {
      subject: user.id,
      expiresIn: `${refresh_token_expiration_days}d`,
    });

    const refresh_token_expiration_date = this.dateProvider.addDays(
      refresh_token_expiration_days,
    );

    await this.usersTokensRepository.create({
      refresh_token,
      user_id: user.id,
      expiration_date: refresh_token_expiration_date,
    });

    const authenticateReturn: IAuthenticateUserResponse = {
      user: {
        name: user.name,
        email: user.email,
      },
      token,
      refresh_token,
    };

    return authenticateReturn;
  }
}

export { AuthenticateUserService };
