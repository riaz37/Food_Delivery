import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

@InputType()
export class RegisterDto {
  @Field()
  @IsNotEmpty({ message: 'Name is required' })
  @IsString()
  name: string;

  @Field()
  @IsEmail()
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @Field()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6)
  password: string;
}

export class LoginDto {
  @Field()
  @IsEmail()
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @Field()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6)
  password: string;
}
