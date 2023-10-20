import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { BlogRepository } from './repositories/blog.repository';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from './entities/blog.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Blog]),
    UserModule,
  ],
  controllers: [BlogController],
  providers: [BlogService, BlogRepository],
})
export class BlogModule {
}
