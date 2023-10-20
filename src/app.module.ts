import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { IamModule } from './iam/iam.module';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostgresConfig } from './config/postgres.config';
import { BlogModule } from './blog/blog.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: `.${process.env.NODE_ENV.trim()}.env`,
			isGlobal: true,
			load: [PostgresConfig]
		}),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService) => ({
				...configService.getOrThrow('postgres')
			}),
			inject: [ConfigService]
		}),
		RedisModule.forRoot({
			config: {
				host: process.env.REDIS_HOST,
				port: parseInt(process.env.REDIS_PORT ?? '6379')
			}
		}),
		UserModule,
		IamModule,
		BlogModule
	]
})
export class AppModule {
}
