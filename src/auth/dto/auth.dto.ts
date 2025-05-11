import { IsString } from "nestjs-swagger-dto";

export class LoginRequestDto {
  
  @IsString({
    name: 'email',
    example: 'user@email.com',
    pattern: {
      regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      message: 'Invalid email format',
    },
  })
  email: string;

  @IsString({name: 'password', minLength:2, maxLength:255})
  password: string;
}

export class RegisterRequestDto {
  
  @IsString({ name: 'name', minLength:2, maxLength:255})
  name: string;

  @IsString({
    name: 'email',
    example: 'user@email.com',
    pattern: {
      regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      message: 'Invalid email format',
    },
  })
  email: string;

  @IsString({name: 'password', minLength:2, maxLength:255})
  password: string;
}

export class LoginResponse {
  @IsString()
  token: string;
}