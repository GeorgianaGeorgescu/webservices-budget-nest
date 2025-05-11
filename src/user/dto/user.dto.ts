import { Expose } from 'class-transformer';
import { IsEmail, Length } from 'class-validator';
import { IsNumber, IsString } from 'nestjs-swagger-dto';

export class PublicUserDto {
  @Expose()
  @IsNumber({ name: 'id', min:1})
  id: number;

  @Expose()
  @IsString({ name: 'name', minLength:2, maxLength:255})
  name: string;

  @Expose()
  @IsString({
    name: 'email',
    example: 'user@email.com',
    pattern: {
      regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      message: 'Invalid email format',
    },
  })
  email: string;
}

export class UpdateUserRequest{

  @IsString({ name: 'name', minLength:2, maxLength:255})
  name?: string;

  @IsString({
    name: 'email',
    example: 'user@email.com',
    pattern: {
      regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      message: 'Invalid email format',
    },
  })
  email?: string;

}

export class UpdateUserResponse extends PublicUserDto {}

export interface UserSession {
  id: number;
  roles: string[];
  email?: string;
}
