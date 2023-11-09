import { IsNotEmpty, Length } from "class-validator";

export class UserRegisterInput {
	@IsNotEmpty()
	public email: string;

	@IsNotEmpty()
	public password: string;
}

export class UserLoginInput {
	@IsNotEmpty()
	public email: string;

	@IsNotEmpty()
	public password: string;
}

export class UserVerifyInput {
	@IsNotEmpty()
	public email: string;

	@IsNotEmpty()
	@Length(6, 6)
	public verificationCode: string;
}
