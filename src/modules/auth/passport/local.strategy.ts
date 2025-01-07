import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from 'src/modules/auth/auth.service';
import { isEmail } from 'class-validator';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'account',
      
    });
  }

  async validate(account: string, password: string): Promise<any> {
    const user = await this.authService.validateAuthor(account, password);
    if (!user) {
      throw new UnauthorizedException(
        'Thông tin tài khoản hoặc mật khẩu không đúng ',
      );
    }

    return user;
  }
}
