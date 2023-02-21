import {
  Injectable,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { pick } from 'lodash';
import { JwtService } from 'src/models/jwt/jwt.service';
import { UserService } from 'src/models/user/user.service';
import { IUserJtwData } from '../interfaces/userJwtData.interfaces';

@Injectable()
export class AuthSubscriptionGuard {
  constructor(
    private jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const { authorization } = ctx.getContext().headers;

    const unauthorizedError = 'Not authorized';
    if (!authorization)
      throw new HttpException(unauthorizedError, HttpStatus.UNAUTHORIZED);

    const token = authorization.split(' ')[1];
    if (!token)
      throw new HttpException(unauthorizedError, HttpStatus.UNAUTHORIZED);

    try {
      const { _id } = this.jwtService.verifyAccessToken(token) as IUserJtwData;
      const user = await this.userService.findById(String(_id));

      const userData = {
        ...pick(user, ['_id', 'email', 'username', 'photo', 'roles']),
      };

      ctx.getContext().user = userData;

      return true;
    } catch (err) {
      throw err;
    }
  }
}
