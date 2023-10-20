import { Column, Entity, PrimaryColumn } from 'typeorm';
import { generateString } from '@nestjs/typeorm';
import { CreateUserEntityDto } from '../dto/create-user.dto';

@Entity()
export class User {
	@PrimaryColumn('uuid')
	id: string;

	@Column({unique: true})
	email: string;

	@Column()
	password: string;

	static create(dto: CreateUserEntityDto) {
		const instance = new User();
		instance.id = generateString();
		instance.email = dto.email;
		instance.password = dto.password;
		return instance;
	}
}
