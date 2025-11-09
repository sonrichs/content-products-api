import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() body: LoginDto) {
    // TODO: Implement signup logic
    return this.authService.validateUser(body);
  }

  @Post('login')
  login(@Body() body: LoginDto) {
    const user = this.authService.validateUser(body);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }
}
