import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { ResetPasswordUserService } from './ResetPasswordUserService';

class ResetPasswordUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { token: reset_password_token } = request.query;
    const { password } = request.body;

    const resetPasswordUserService = container.resolve(
      ResetPasswordUserService,
    );

    resetPasswordUserService.execute({
      reset_password_token: String(reset_password_token),
      password,
    });

    return response.status(201).json('Password reseted!');
  }
}

export { ResetPasswordUserController };
