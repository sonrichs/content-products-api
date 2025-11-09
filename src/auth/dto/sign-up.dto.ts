import { IsEmail, IsString } from 'class-validator';

export class SignUpDto {
  @IsEmail()
  username: string;

  @IsString()
  password: string;
}
