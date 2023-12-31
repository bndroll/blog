import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';


export class SignUpDto {
	@IsNotEmpty()
	@IsEmail()
	email: string;

	@IsNotEmpty()
	@MinLength(5)
	password: string;
}
