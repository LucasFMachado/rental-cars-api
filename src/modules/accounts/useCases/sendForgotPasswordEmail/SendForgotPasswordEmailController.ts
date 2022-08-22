import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { SendForgotPasswordEmailService } from './SendForgotPasswordEmailService';

class SendForgotPasswordEmailController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { email } = request.body;

    const sendForgotPasswordEmailService = container.resolve(
      SendForgotPasswordEmailService,
    );

    await sendForgotPasswordEmailService.execute(email);

    return response.status(201).json('Recovery password link sent!');
  }
}

export { SendForgotPasswordEmailController };
