import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthorService } from '../author/author.service';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import { AuthBy, Author } from 'src/database/entities/author.entity';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class GoogleAuthService {
  oauthClient: OAuth2Client;
  constructor(
    private readonly authorService: AuthorService,
    private readonly configService: ConfigService,
    private readonly authService: AuthService
  ) {
    const clientId = this.configService.get('GOOGLE_AUTH_CLIENT_ID');
    const clientSecret = this.configService.get('GOOGLE_AUTH_CLIENT_SECRET');
    this.oauthClient = new OAuth2Client({
      clientId,
      clientSecret,
    });
  }

  async authenticate(token: string) {
    const userData = await this.getAuthorData(token);
    const user = await this.authorService.getByEmail(userData.email);
    if (user) {
      return this.handleRegisterdUser(user);
    }

    return this.registerUser(userData);
  }

  async registerUser(userData: TokenPayload) {
    const author: Author = await this.authorService.createWithGoogle(userData);

    return this.handleRegisterdUser(author);
  }

  async getAuthorData(token: string) {
    const ticket = await this.oauthClient.verifyIdToken({
      idToken: token,
      audience: this.configService.get('GOOGLE_AUTH_CLIENT_ID'),
    });
    const payload = ticket.getPayload();
    return payload;
  }

  async handleRegisterdUser(author: Author) {
    if (author.authBy !== AuthBy.GOOGLE) {
      throw new BadRequestException('Email đã có người sử dụng');
    }

    const { accessTokenCookie, refreshTokenCookie } =
      await this.getCookiesForUser(author);

    return {
      accessTokenCookie,
      refreshTokenCookie,
      author    };
  }

  async getCookiesForUser(author: Author) {
    const { cookie: accessTokenCookie } =
      await this.authService.getCookieWithJwtAccessToken(author.id);
    const { cookie: refreshTokenCookie, token: refreshToken } =
      await this.authService.getCookieWithJwtRefreshToken(author.id);

    await this.authService.setCurrentRefreshToken(refreshToken, author.id);

    return {
      accessTokenCookie,
      refreshTokenCookie,
    };
  }
}
