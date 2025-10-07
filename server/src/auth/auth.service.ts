/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;
    const match = await bcrypt.compare(pass, user.password);
    if (match) {
      // return a copy without password
      const { password, ...rest } = user.toObject ? user.toObject() : user;
      return rest;
    }
    return null;
  }

  async login(user: any) {
  const payload = { sub: user._id, email: user.email, name: user.name };
  const token = this.jwtService.sign(payload);
  
  console.log("Token : ", token);

  // Include user object and default roles so the frontend receives `{ access_token, user, roles }`
  const safeUser = { _id: user._id, email: user.email, name: user.name };
  const roles = ['user'];
  return { access_token: token, user: safeUser};
}


  async register(email: string, password: string, name?: string) {
    const exists = await this.usersService.findByEmail(email);
    if (exists) {
      throw new UnauthorizedException('Email already registered');
    }
    const user = await this.usersService.create({ email, password, name });
    return this.login(user);
  }
}
