import { resolve } from 'path';
import { inject, injectable } from 'tsyringe';
import { v4 as uuid } from 'uuid';

import { IUsersRepository } from '@modules/accounts/repositories/interfaces/IUsersRepository';
import { IUsersTokensRepository } from '@modules/accounts/repositories/interfaces/IUsersTokensRepository';
import { IDateProvider } from '@shared/container/providers/DateProvider/interfaces/IDateProvider';
import { IMailProvider } from '@shared/container/providers/MailProvider/interfaces/IMailProvider';
import { AppError } from '@shared/errors/AppError';

@injectable()
class SendForgotPasswordEmailService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('UsersTokensRepository')
    private usersTokensRepository: IUsersTokensRepository,
    @inject('DateProvider')
    private dateProvider: IDateProvider,
    @inject('MailProvider')
    private mailProvider: IMailProvider,
  ) {}

  async execute(email: string): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('USer does not exists!');
    }

    const expiration_date = this.dateProvider.addHours(3);
    const token = uuid();

    await this.usersTokensRepository.create({
      refresh_token: token,
      user_id: user.id,
      expiration_date,
    });

    const templatePath = resolve(
      __dirname,
      '..',
      '..',
      'views',
      'emails',
      'forgorPassword.hbs',
    );

    const variables = {
      name: user.name,
      link: `${process.env.EMAIL_FORGOT_PASSWORD_URL}${token}`,
    };

    await this.mailProvider.sendMail(
      email,
      'Password recovery',
      variables,
      templatePath,
    );
  }
}

export { SendForgotPasswordEmailService };
