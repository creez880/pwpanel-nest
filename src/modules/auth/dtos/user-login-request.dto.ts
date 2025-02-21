import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class UserLoginRequestDto {
  @IsNotEmpty({ message: 'Username is required' })
  @IsString()
  @Transform(({ value }) => value.trim())
  @Matches(/^\S+$/, { message: 'Username cannot contain spaces' })
  username: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsString()
  @Transform(({ value }) => value?.trim())
  @Matches(/^\S+$/, { message: 'Password cannot contain spaces' })
  password: string;
}
