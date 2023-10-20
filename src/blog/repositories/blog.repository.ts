import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Blog } from '../entities/blog.entity';
import { FindUniqueDto } from '../dto/find-unique.dto';

@Injectable()
export class BlogRepository extends Repository<Blog> {
  constructor(private dataSource: DataSource) {
    super(Blog, dataSource.createEntityManager());
  }

  async findAll() {
    return await this.find({ order: { createdDate: 'DESC' } });
  }

  async findById(id: string) {
    return await this.findOneBy({ id });
  }

  async findUnique(dto: FindUniqueDto) {
    return await this.findOne({ where: { title: dto.title, authorId: dto.authorId } });
  }

  async findByAuthorId(authorId: string) {
    return await this.find({
      where: { authorId: authorId },
      order: { createdDate: 'DESC' },
    });
  }
}