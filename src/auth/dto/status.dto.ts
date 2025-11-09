import { PartialType } from '@nestjs/mapped-types';
import { SignInResultDto } from './sign-in-result.dto';

export class StatusDto extends PartialType(SignInResultDto) {
  sub: string;
  username: string;
}
