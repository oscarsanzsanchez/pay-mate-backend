import { compareSync, hashSync } from "bcrypt";
import { UserRegisterInput, UserVerifyInput } from "dtos/user";
import { User } from "entities/User";
import { throwControlledError } from "errors/throwControlledError";
import { DateTime } from "luxon";
import { dbClient } from "vendors/dbConnector";

export class AuthService {
	private _userRepository = dbClient.getRepository(User);

	private _generateVerificationCode() {
		return Math.random().toString(36).substring(2, 8).toUpperCase();
	}

	public async register(newUser: UserRegisterInput) {
		const user = await this._userRepository.findOne({
			where: {
				email: newUser.email
			}
		});

		if (user) {
			throwControlledError({
				statusCode: 409,
				message: "User already exists"
			});
		}

		await this._userRepository.insert({
			...newUser,
			password: hashSync(newUser.password, 10),
			verificationCode: this._generateVerificationCode(),
			verificationCodeExpiresAt: DateTime.utc().plus({ minutes: 15 }).toJSDate()
		});

		return this._userRepository.findOne({
			where: {
				email: newUser.email
			}
		});
	}

	public async verifyUser(body: UserVerifyInput) {
		const { verificationCode, email } = body;
		const user = await this._userRepository.findOne({
			select: ["id", "verificationCode", "verificationCodeExpiresAt", "verifiedAt"],
			where: {
				email
			}
		});

		console.log(user);

		if (!user) {
			throwControlledError({
				statusCode: 404,
				message: "User not found"
			});
			return;
		}

		if (user.verifiedAt) {
			throwControlledError({
				statusCode: 409,
				message: "User already verified"
			});
			return;
		}

		if (!user.verificationCodeExpiresAt) {
			throwControlledError({
				statusCode: 500,
				message: "Verification code could did not generate properly"
			});
			return;
		}

		if (user.verificationCodeExpiresAt < DateTime.utc().toJSDate()) {
			throwControlledError({
				statusCode: 409,
				message: "Verification code expired"
			});
			return;
		}

		if (user.verificationCode !== verificationCode) {
			throwControlledError({
				statusCode: 409,
				message: "Bad verification code"
			});
			return;
		}

		await this._userRepository.update(user.id, {
			verificationCode: null,
			verificationCodeExpiresAt: null,
			verifiedAt: DateTime.utc().toJSDate()
		});

		return;
	}

	public async login(body: UserRegisterInput) {
		const { email, password } = body;
		const user = await this._userRepository.findOne({
			select: ["id", "email", "password", "isActive", "verifiedAt"],
			where: {
				email
			}
		});

		if (!user || !compareSync(password, user.password)) {
			throwControlledError({
				statusCode: 404,
				message: "Bad user credentials"
			});
			return;
		}

		if (!user.verifiedAt) {
			throwControlledError({
				statusCode: 401,
				message: "User not verified"
			});
			return;
		}

		if (!user.isActive) {
			throwControlledError({
				statusCode: 401,
				message: "User not active"
			});
			return;
		}

		return;
	}
}
