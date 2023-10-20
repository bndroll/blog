import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Auth } from '../iam/decorators/auth.decorator';
import { AuthType } from '../iam/enums/auth-type.enum';
import { ActiveUser } from '../iam/decorators/active-user.decorator';

@Auth(AuthType.Bearer)
@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {
  }

  @Post()
  async create(@ActiveUser('id') userId: string, @Body() dto: CreateBlogDto) {
    return this.blogService.create(userId, dto);
  }

  @Get()
  @Auth(AuthType.None)
  async findAll() {
    return this.blogService.findAll();
  }

  @Get(':id')
  @Auth(AuthType.None)
  async findById(@Param('id') id: string) {
    return this.blogService.findById(id);
  }

  @Patch(':id')
  async update(
    @ActiveUser('id') userId: string,
    @Param('id') id: string,
    @Body() updateBlogDto: UpdateBlogDto)
  {
    return this.blogService.update(userId, id, updateBlogDto);
  }

  @Delete(':id')
  async remove(@ActiveUser('id') userId: string, @Param('id') id: string) {
    return this.blogService.remove(userId, id);
  }
}
