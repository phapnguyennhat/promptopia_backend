import { Module } from '@nestjs/common';
import { GoogleAuthService } from './google-auth.service';
import { GoogleAuthController } from './google-auth.controller';
import { AuthModule } from '../auth/auth.module';
import { AuthorModule } from '../author/author.module';

@Module({
  imports: [AuthModule, AuthorModule],
  controllers: [GoogleAuthController],
  providers: [GoogleAuthService],
})
export class GoogleAuthModule {}
