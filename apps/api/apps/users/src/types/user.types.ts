import { ObjectType, Field } from '@nestjs/graphql';
import { User } from '../entities/user.entity';

@ObjectType()
export class ErrorType {
  @Field()
  message: string;

  @Field({ nullable: true })
  statusCode: number;
}

@ObjectType()
export class RegisterResponseType {
  @Field(() => User, { nullable: true })
  user: User;

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
}

@ObjectType()
export class LoginResponseType {
  @Field(() => User, { nullable: true })
  user: User;

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
}
