import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

import auth from '@config/auth';
import { UsersRepository } from '@modules/accounts/infra/typeorm/repositories/UsersRepository';
import { UsersTokensRepository } from '@modules/accounts/infra/typeorm/repositories/UsersTokensRepository';
import { AppError } from '@shared/errors/AppError';

interface ITokenPayload {
  sub: string;
}

export async function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('Token missing', 401);
  }

  const [, token] = authHeader.split(' ');

  try {
    const { sub: user_id } = verify(token, auth.token_secret) as ITokenPayload;

    const usersRepository = new UsersRepository();
    const user = usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User does not exists!', 401);
    }

    request.user = { id: user_id };

    next();
  } catch {
    throw new AppError('Invalid token!', 401);
  }
}
