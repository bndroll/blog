import { Injectable } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {
  }

  async findMe(id: string) {
    return await this.userRepository.findById(id);
  }
}
