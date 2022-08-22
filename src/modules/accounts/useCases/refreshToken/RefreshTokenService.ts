import { sign, verify } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

import auth from '@config/auth';
import { IUsersTokensRepository } from '@modules/accounts/repositories/interfaces/IUsersTokensRepository';
import { IDateProvider } from '@shared/container/providers/DateProvider/interfaces/IDateProvider';
import { AppError } from '@shared/errors/AppError';

interface ITokenPayload {
  sub: string;
  email: string;
}

interface IRefreshTokenResponse {
  token: string;
  refresh_token: string;
}

@injectable()
class RefreshTokenService {
  constructor(
    @inject('UsersTokensRepository')
    private usersTokensRepository: IUsersTokensRepository,
    @inject('DateProvider')
    private dateProvider: IDateProvider,
  ) {}

  async execute(old_refresh_token: string): Promise<IRefreshTokenResponse> {
    const {
      token_secret,
      token_expires_in,
      refresh_token_secret,
      refresh_token_expiration_days,
    } = auth;

    const { sub: user_id, email } = verify(
      old_refresh_token,
      refresh_token_secret,
    ) as ITokenPayload;

    const userToken =
      await this.usersTokensRepository.findByUserIdAndRefreshToken(
        user_id,
        old_refresh_token,
      );

    if (!userToken) {
      throw new AppError('Refresh token does not exists!');
    }

    await this.usersTokensRepository.deleteById(userToken.id);

    const refresh_token = sign({ email }, refresh_token_secret, {
      subject: user_id,
      expiresIn: `${refresh_token_expiration_days}d`,
    });

    const expiration_date = this.dateProvider.addDays(
      refresh_token_expiration_days,
    );

    await this.usersTokensRepository.create({
      refresh_token,
      user_id,
      expiration_date,
    });

    const newToken = sign({}, token_secret, {
      subject: user_id,
      expiresIn: token_expires_in,
    });

    return {
      token: newToken,
      refresh_token,
    };
  }
}

export { RefreshTokenService };
