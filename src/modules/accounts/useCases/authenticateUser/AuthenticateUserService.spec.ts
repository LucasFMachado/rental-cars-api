import { AppError } from '../../../../errors/AppError';
import { ICreateUserDTO } from '../../dtos/ICreateUserDTO';
import { UsersRepositoryInMemory } from '../../repositories/in-memory/UsersRepositoryInMemory';
import { CreateUserService } from '../createUser/CreateUserService';
import { AuthenticateUserService } from './AuthenticateUserService';

let authenticateUserService: AuthenticateUserService;
let createUserService: CreateUserService;
let usersRepository: UsersRepositoryInMemory;

describe('Authenticate user', () => {
  beforeEach(() => {
    usersRepository = new UsersRepositoryInMemory();
    authenticateUserService = new AuthenticateUserService(usersRepository);
    createUserService = new CreateUserService(usersRepository);
  });

  it('Should be able to authenticatea an user', async () => {
    const user: ICreateUserDTO = {
      name: 'User name test',
      email: 'username@test.com',
      password: '0000000',
      driver_licence: '0000000',
    };

    await createUserService.execute(user);

    const result = await authenticateUserService.execute({
      email: user.email,
      password: user.password,
    });

    expect(result).toHaveProperty('token');
  });

  // it('should not be able to authenticate a none existent user ', async () => {
  //   await expect(
  //     authenticateUserService.execute({
  //       email: 'maluco ta doido',

  //       password: '123',
  //     }),
  //   ).rejects.toBeInstanceOf(AppError);
  // });

  it('Should not be able to athenticate a none existent user', async () => {
    const user: ICreateUserDTO = {
      name: 'User name test',
      email: 'username@test.com',
      password: '0000000',
      driver_licence: '0000000',
    };

    await expect(
      authenticateUserService.execute({
        email: user.email,
        password: user.password,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to athenticate with incorrect password', async () => {
    const user: ICreateUserDTO = {
      name: 'User name test',
      email: 'username@test.com',
      password: '0000000',
      driver_licence: '0000000',
    };

    await createUserService.execute(user);

    await expect(
      authenticateUserService.execute({
        email: user.email,
        password: 'incorrectPassword',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
