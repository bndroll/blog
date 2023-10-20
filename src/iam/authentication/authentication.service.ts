import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../../user/entities/user.entity';
import { HashingService } from '../hashing/hashing.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { ActiveUserData } from '../interfaces/active-user-data.interface';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { InvalidatedRefreshTokenError, RefreshTokenIdsStorage } from './refresh-token-ids.storage';
import { randomUUID } from 'crypto';
import { UserRepository } from '../../user/repositories/user.repository';
import { UserErrorMessages } from '../../user/constants/user.constants';
import { AuthenticationErrorMessages } from './constants/authentication.constants';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY) private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly refreshTokenIdsStorage: RefreshTokenIdsStorage,
  ) {
  }

  async signUp(dto: SignUpDto) {
    const oldUser = await this.userRepository.findByEmail(dto.email);
    if (oldUser) {
      throw new BadRequestException(UserErrorMessages.AlreadyExist);
    }

    const hashingPassword = await this.hashingService.hash(dto.password);
    const user = User.create({
      email: dto.email,
      password: hashingPassword,
    });
    return await this.userRepository.save(user);
  }

  async signIn(dto: SignInDto) {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException(UserErrorMessages.NotFound);
    }

    const isEqual = await this.hashingService.compare(dto.password, user.password);
    if (!isEqual) {
      throw new UnauthorizedException(UserErrorMessages.WrongPassword);
    }

    return await this.generateTokens(user);
  }

  async signOut(id: string) {
    await this.refreshTokenIdsStorage.invalidate(id);
  }

  async refreshToken(dto: RefreshTokenDto) {
    try {
      const {
        id,
        refreshTokenId,
      } = await this.jwtService.verifyAsync<Pick<ActiveUserData, 'id'> & { refreshTokenId: string }>(
        dto.refreshToken,
        {
          secret: this.jwtConfiguration.secret,
        });

      const user = await this.userRepository.findById(id);
      const isValid = await this.refreshTokenIdsStorage.validate(user.id, refreshTokenId);
      if (isValid) {
        await this.refreshTokenIdsStorage.invalidate(user.id);
      } else {
        throw new Error(AuthenticationErrorMessages.InvalidRefresh);
      }

      return await this.generateTokens(user);
    } catch (err) {
      if (err instanceof InvalidatedRefreshTokenError) {
        throw new UnauthorizedException(AuthenticationErrorMessages.DeniedAccess);
      }

      throw new UnauthorizedException();
    }
  }

  async generateTokens(user: User) {
    const refreshTokenId = randomUUID();
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken<Partial<ActiveUserData>>(
        user.id, this.jwtConfiguration.accessTokenTtl, { email: user.email },
      ),
      this.signToken(user.id, this.jwtConfiguration.refreshTokenTtl, { refreshTokenId }),
    ]);

    await this.refreshTokenIdsStorage.insert(user.id, refreshTokenId);

    return { accessToken, refreshToken };
  }

  private async signToken<T>(userId: string, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      {
        id: userId,
        ...payload,
      }, {
        secret: this.jwtConfiguration.secret,
        expiresIn: expiresIn,
      });
  }
}
