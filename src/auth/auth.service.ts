import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../modules/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SignUpDto } from './dto/sign-up.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(body: SignUpDto) {
    const { username, password } = body;

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await this.usersService.create({
      username,
      password: hashedPassword,
    });

    return await this.signIn(user.id, user.username);
  }

  async authenticate({ username, password }: LoginDto) {
    const user = await this.validateUser({ username, password });
    if (!user) {
      return null;
    }
    return this.signIn(user.id, user.username);
  }

  async validateUser({ username, password }: LoginDto) {
    const existingUser = await this.usersService.findOneByUsername(username);
    if (!existingUser) {
      return null;
    }
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password,
    );
    if (!isPasswordValid) {
      return null;
    }
    return existingUser;
  }

  async signIn(userId: string, username: string) {
    const payload = { sub: userId, username };
    return {
      accessToken: await this.jwtService.signAsync(payload),
      sub: payload.sub,
      username: payload.username,
    };
  }
}
