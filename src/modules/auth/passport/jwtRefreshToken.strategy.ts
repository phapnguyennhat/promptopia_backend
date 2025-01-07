import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { AuthorService } from 'src/modules/author/author.service';
import { JWT_REFRESH_TOKEN } from 'src/common/constant';
import { IAuthPayload } from 'src/database/entities/author.entity';


@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  JWT_REFRESH_TOKEN,
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authorService: AuthorService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Refresh;
        },
      ]),
      secretOrKey: configService.get('JWT_REFRESH_TOKEN_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: IAuthPayload) {
    const refreshToken = request.cookies?.Refresh;
    return this.authorService.getUserIfRefreshTokenMatches(
      refreshToken,
      payload.authorId,
    );
  }
}
