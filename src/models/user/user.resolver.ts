import { Resolver, Mutation, Args, Query, Subscription } from '@nestjs/graphql';
import { UserService } from './user.service';
import { UserType } from './types/user.type';
import { CreateUserInput } from './dto/createUser.input';
import { UseGuards } from '@nestjs/common';
import { IsConfirmPassword } from './guards/isConfirmPassword';

import { UserQueryType } from './types/userQuery.type';
import { UserTypeResponse } from './types/userResponse.type';
import { LoginUserInput } from './dto/loginUserInput';
import { UpdateUsernameInput } from './dto/updateUsername.input';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { CurrentUser } from 'src/common/decorators/currentUser.decorator';
import { ICurrentUser } from 'src/common/interfaces/currentUser.interfaces';
import { QueryInput } from 'src/common/dto/query.type';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query((returns) => UserQueryType)
  getUsers(@Args('query') query: QueryInput) {
    return this.userService.findAll(query);
  }

  @UseGuards(IsConfirmPassword)
  @Mutation((returns) => UserTypeResponse)
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.userService.create(createUserInput);
  }

  @Mutation((returns) => UserTypeResponse)
  login(@Args('loginUserInput') loginUserInput: LoginUserInput) {
    return this.userService.login(loginUserInput);
  }

  @UseGuards(AuthGuard)
  @Mutation((returns) => UserType)
  updateUsername(
    @Args('updateUsernameInput') updateUsernameInput: UpdateUsernameInput,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return this.userService.updateUsernameInput(
      updateUsernameInput,
      currentUser,
    );
  }
}
