import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { BlogRepository } from './repositories/blog.repository';
import { BlogErrorMessages } from './constants/blog.constants';
import { Blog } from './entities/blog.entity';
import { UserRepository } from 'src/user/repositories/user.repository';
import { UserErrorMessages } from '../user/constants/user.constants';

@Injectable()
export class BlogService {
  constructor(
    private readonly blogRepository: BlogRepository,
    private readonly userRepository: UserRepository,
  ) {
  }

  async create(userId: string, dto: CreateBlogDto) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(UserErrorMessages.NotFound);
    }

    const oldBlog = await this.blogRepository.findUnique({
      title: dto.title,
      authorId: userId,
    });
    if (oldBlog) {
      throw new BadRequestException(BlogErrorMessages.AlreadyExist);
    }

    const blog = Blog.create({
      title: dto.title,
      body: dto.body,
      authorId: user.id,
    });
    return await this.blogRepository.save(blog);
  }

  async findAll() {
    return await this.blogRepository.findAll();
  }

  async findById(id: string) {
    const blog = await this.blogRepository.findById(id);
    if (!blog) {
      throw new NotFoundException(BlogErrorMessages.NotFound);
    }
    return blog;
  }

  async update(userId: string, id: string, dto: UpdateBlogDto) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(UserErrorMessages.NotFound);
    }

    const blog = await this.blogRepository.findById(id);
    if (!blog) {
      throw new NotFoundException(BlogErrorMessages.NotFound);
    }

    if (blog.authorId !== user.id) {
      throw new BadRequestException(BlogErrorMessages.NoPermission);
    }

    blog.update(dto);
    return await this.blogRepository.save(blog);
  }

  async remove(userId: string, id: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(UserErrorMessages.NotFound);
    }

    const blog = await this.blogRepository.findById(id);
    if (!blog) {
      throw new NotFoundException(BlogErrorMessages.NotFound);
    }

    if (blog.authorId !== user.id) {
      throw new BadRequestException(BlogErrorMessages.NoPermission);
    }

    return await this.blogRepository.remove(blog);
  }
}
