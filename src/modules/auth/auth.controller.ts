import { UserLoginInput, UserRegisterInput, UserVerifyInput } from "dtos/user";
import { Body, Controller, Post, Route } from "tsoa";
import { AuthService } from "./auth.service";

@Route("auth")
export class AuthController extends Controller {
	private _authService: AuthService;

	constructor() {
		super();
		this._authService = new AuthService();
	}

	@Post("/register")
	public register(@Body() body: UserRegisterInput) {
		this.setStatus(201);
		return this._authService.register(body);
	}

	@Post("/verify")
	public verify(@Body() body: UserVerifyInput) {
		this.setStatus(204);
		return this._authService.verifyUser(body);
	}

	@Post("/login")
	public login(@Body() body: UserLoginInput) {
		this.setStatus(200);
		return this._authService.login(body);
	}
}
