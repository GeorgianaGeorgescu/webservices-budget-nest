import { Expose } from 'class-transformer';
import { IsEmail, IsString, Length } from 'class-validator';

export class PublicUserDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  email: string;
}

export class UpdateUserRequest{

  @IsString()
  @Length(2, 255)
  name?: string;

  @IsString()
  @IsEmail()
  email?: string;

}

export class UpdateUserResponse extends PublicUserDto {}

