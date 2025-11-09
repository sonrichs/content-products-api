import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { SignInResultDto } from '../dto/sign-in-result.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<SignInResultDto> {
    const result = await this.authService.authenticate({ username, password });
    if (!result) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return result;
  }
}
