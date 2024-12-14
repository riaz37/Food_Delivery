import { RegisterResponseType } from './types/user.types';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { RegisterDto } from './dto/user.dto';
import { User } from './entities/user.entity';
import { Response } from 'express';

@Resolver('User')
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}
  @Mutation(() => RegisterResponseType)
  async register(
    @Args('registerDto') registerDto: RegisterDto,
    @Context() context: { res: Response },
  ): Promise<RegisterResponseType> {
    if (!registerDto.name || !registerDto.email || !registerDto.password) {
      throw new Error('All fields are required');
    }
    const user = await this.usersService.register(registerDto, context.res);
    return { user};
  }

  @Query(() => [User])
  async getUsers() {
    return this.usersService.getUsers();
  }
}
