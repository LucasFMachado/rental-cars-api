import 'reflect-metadata';
import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import swaggerUi from 'swagger-ui-express';

import { AppError } from '@shared/errors/AppError';

import swaggerFile from '../../../swagger.json';
import { routes } from './routes';

import '@shared/infra/typeorm';

import '@shared/container';

const app = express();

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use(routes);

app.use(
  (err: Error, request: Request, response: Response, next: NextFunction) => {
    if (err instanceof AppError) {
      return response
        .status(err.statusCode)
        .json({ status: `${err.statusCode}`, message: err.message });
    }

    return response.status(500).json({
      status: 'error',
      message: `Internal server error: ${err.message}`,
    });
  },
);

app.listen(3333, () => console.log('Server is running!'));
