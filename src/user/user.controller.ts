import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { ActiveUser } from '../iam/decorators/active-user.decorator';
import { Auth } from '../iam/decorators/auth.decorator';
import { AuthType } from '../iam/enums/auth-type.enum';

@Auth(AuthType.Bearer)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {
  }

  @Get('find/me')
  async findMe(@ActiveUser('id') id: string) {
    return this.userService.findMe(id);
  }
}
