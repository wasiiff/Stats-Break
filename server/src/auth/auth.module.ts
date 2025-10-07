/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { UsersModule } from '../users/user.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller'; // <-- import controller
import { config } from 'dotenv';
config();

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret',
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '3600s' },
    }),
  ],
  controllers: [AuthController], // <-- register controller
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
