import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';
import { CreateBlogEntityDto } from '../dto/create-blog.dto';
import { UpdateBlogEntityDto } from '../dto/update-blog.dto';
import { generateString } from '@nestjs/typeorm';

@Entity()
export class Blog {
  @PrimaryColumn('uuid')
  id: string;

  @Column('varchar')
  title: string;

  @Column('text')
  body: string;

  @Column('uuid')
  authorId: string;

  @CreateDateColumn()
  createdDate: Date;

  static create(dto: CreateBlogEntityDto) {
    const instance = new Blog();
    instance.id = generateString();
    instance.title = dto.title;
    instance.body = dto.body;
    instance.authorId = dto.authorId;
    return instance;
  }

  update(dto: UpdateBlogEntityDto) {
    this.title = dto.title ?? this.title;
    this.body = dto.body ?? this.body;
  }
}
