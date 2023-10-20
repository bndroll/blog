import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async findById(id: string) {
    return await this.findOne({
      where: { id },
      select: {
        id: true,
        email: true,
      },
    });
  }

  async findByEmail(email: string) {
    return await this.findOneBy({ email });
  }
}