import { Expose } from 'class-transformer';

export class SignInResultDto {
  @Expose()
  accessToken: string;
  @Expose()
  sub: string;
  @Expose()
  username: string;
}
