import { BadGatewayException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/user.dto';
import * as crypto from 'crypto';
import { PrismaService } from 'prisma/prisma.service';
import { Response } from 'express';

@Injectable()
export class UsersService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {}

  //register user
  async register(registerDto: RegisterDto, response: Response) {
    const { name, email, password } = registerDto;

    const isEmailExist = await this.prismaService.user.findUnique({
      where: {
        email: email,
      },

    })

    if (isEmailExist) {
      throw new BadGatewayException('Email already exist');
    }
    const user = await this.prismaService.user.create({
      data: {
        name,
        email,
        password,
      },
    });
    return { ...user };
  }

  //login user
  async login(loginDto: RegisterDto) {
    const { email, password } = loginDto;
    const user = {
      email,
      password,
    };
    return user;
  }

  //get all users
  async getUsers() {
    return this.prismaService.user.findMany();
  }
}
