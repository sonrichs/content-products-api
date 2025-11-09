import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UsersService } from 'src/modules/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  validateUser(user: LoginDto) {
    const { email, password } = user;
    const existingUser = this.usersService.fakeFindOneByEmail(email);
    if (!existingUser || existingUser.password !== password) {
      return null;
    }
    const result = { id: existingUser.id, email: existingUser.email };
    return {
      access_token: this.jwtService.sign(result),
    };
  }
}
