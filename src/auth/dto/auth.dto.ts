import { IsEmail, IsString, Length } from "class-validator";

export class LoginRequestDto {
  @IsEmail()
  @IsString()
  email: string;

  @Length(2, 255)
  @IsString()
  password: string;
}

export class RegisterRequestDto {
  @IsString()
  @Length(2, 255)
  @IsString()
  name: string;

  @IsEmail()
  @IsString()
  email: string;

  @Length(2, 255)
  @IsString()
  password: string;
}
