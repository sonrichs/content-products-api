import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local.guard';
import { JwtGuard } from './guards/jwt.guard';
import { SignUpDto } from './dto/sign-up.dto';
import type { Request } from 'express';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { SignInResultDto } from './dto/sign-in-result.dto';
import { LoginDto } from './dto/login.dto';
import { StatusDto } from './dto/status.dto';
import { Serialize } from '../interceptors/serialize.interceptor';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Serialize(SignInResultDto)
  @Post('signup')
  signup(@Body() body: SignUpDto): Promise<SignInResultDto> {
    return this.authService.signUp(body);
  }

  @Serialize(SignInResultDto)
  @Post('login')
  @ApiBody({ type: LoginDto })
  @UseGuards(LocalGuard)
  login(@Req() req: Request): Promise<SignInResultDto> {
    return Promise.resolve(req.user as SignInResultDto);
  }

  @Serialize(StatusDto)
  @Get('status')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  status(@Req() req: Request): Promise<StatusDto> {
    return Promise.resolve(req.user as StatusDto);
  }
}
