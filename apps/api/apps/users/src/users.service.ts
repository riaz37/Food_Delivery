import { BadGatewayException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto, LoginDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'prisma/prisma.service';
import { Response } from 'express';
import { EmailService } from './email/email.service';


interface UserData {
  name: string;
  email: string;
  password: string;
  phone_number: number;
  address: string;
}

@Injectable()
export class UsersService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  //register user
  async register(registerDto: RegisterDto, response: Response) {
    const { name, email, password, phone_number, address } = registerDto;

    const isEmailExist = await this.prismaService.user.findUnique({
      where: {
        email: email,
      },
    });

    if (isEmailExist) {
      throw new BadGatewayException('Email already exist');
    }

    const isPhoneNumberExist = await this.prismaService.user.findUnique({
      where: {
        phone_number: phone_number,
      },
    });

    if (isPhoneNumberExist) {
      throw new BadGatewayException('Phone number already exist');
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const user = {
      id: require('crypto').randomBytes(4).toString('hex'),
      name,
      email,
      password: hashPassword,
      phone_number,
      address,
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const activationToken = await this.createActivationToken(user);

    const activationCode = activationToken.activationCode;

    await this.emailService.sendMail({
      email,
      subject: 'Activate your account!',
      template: 'activation-mail',
      name,
      activationCode,
    });

    return { ...user, response };
  }

  //login user
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = {
      email,
      password,
    };
    return user;
  }
  // Activationoken

  async createActivationToken(user: UserData) {
    const activationCode = Math.floor(
      Math.random() * (9999 - 1000) + 1000,
    ).toString();

    const token = this.jwtService.sign(
      {
        user,
        activationCode,
      },
      {
        secret: this.configService.get('ACTIVATION_SECRET'),
        expiresIn: '1d',
      },
    );
    return { token, activationCode };
  }

  //get all users
  async getUsers() {
    return this.prismaService.user.findMany();
  }
}
