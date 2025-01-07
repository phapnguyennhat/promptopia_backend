import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegiserDto } from './dtos/register.dto';
import * as bcrypt from 'bcrypt';
import { AuthorService } from '../author/author.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import JwtAuthGuard from './guards/jwt-auth.guard';
import JwtRefreshGuard from './guards/jwtRefresh.guard';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly authorService: AuthorService,
  ) {}

  @Post('/register')
  async register(@Body() registerDto: RegiserDto) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    return this.authorService.create({
      ...registerDto,
      password: hashedPassword,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() request) {
    await this.authorService.removeRefreshToken(request.user.id);
    request.res.setHeader('Set-Cookie', this.authService.getCookieForLogOut());
    return { message: 'Đăng xuất thành công' };
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  async login(@Req() req) {
    const accessTokenCookie =
      await this.authService.getCookieWithJwtAccessToken(req.user?.id);
    const refreshTokenCookie =
      await this.authService.getCookieWithJwtRefreshToken(req.user?.id);
    await this.authService.setCurrentRefreshToken(
      refreshTokenCookie.token,
      req.user?.id,
    );

    req.res.setHeader('Set-Cookie', [
      accessTokenCookie.cookie,
      refreshTokenCookie.cookie,
    ]);
    return { message: 'Đăng nhập thành công ' };
  }

  @UseGuards(JwtRefreshGuard)
  @Post('/refresh')
  async refresh(@Req() req) {
    const accessTokenCookie =
      await this.authService.getCookieWithJwtAccessToken(req.user.id);

    req.res.setHeader('Set-Cookie', accessTokenCookie.cookie);
    return {
      accessToken: accessTokenCookie.token,
      accessTime: accessTokenCookie.accessTime,
    };
  }
}
