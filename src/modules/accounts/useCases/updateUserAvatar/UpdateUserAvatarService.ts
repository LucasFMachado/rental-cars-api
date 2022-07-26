import { inject, injectable } from 'tsyringe';

import { IUsersRepository } from '@modules/accounts/repositories/interfaces/IUsersRepository';
import { deleteFile } from '@utils/file';

interface IUpdateUserAvatarRequest {
  user_id: string;
  avatar_file: string;
}

@injectable()
class UpdateUserAvatarService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  async execute({
    user_id,
    avatar_file,
  }: IUpdateUserAvatarRequest): Promise<void> {
    const user = await this.usersRepository.findById(user_id);

    if (user.avatar) {
      await deleteFile(`./tmp/avatar/${user.avatar}`);
    }

    user.avatar = avatar_file;

    await this.usersRepository.create(user);
  }
}

export { UpdateUserAvatarService };
