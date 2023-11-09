import { Column, CreateDateColumn, Entity } from "typeorm";

@Entity()
export class User {
	constructor(email: string, password: string) {
		this.email = email;
		this.password = password;
	}

	@Column("uuid", { primary: true, generated: "uuid" })
	public id: string;

	@Column("text", {
		nullable: false,
		unique: true
	})
	public email: string;

	@Column("text", {
		nullable: false,
		select: false
	})
	public password: string;

	@Column("boolean", {
		default: false,
		nullable: false,
		select: false
	})
	public isActive: boolean;

	@CreateDateColumn({
		type: "timestamp",
		nullable: false
	})
	public createdAt: Date;

	@Column("varchar", {
		select: false,
		length: 6,
		nullable: true
	})
	public verificationCode: string | null;

	@CreateDateColumn({
		type: "timestamp",
		nullable: true,
		default: null
	})
	public verificationCodeExpiresAt: Date | null;

	@Column("timestamp", {
		nullable: true,
		default: null
	})
	public verifiedAt: Date | null;
}
