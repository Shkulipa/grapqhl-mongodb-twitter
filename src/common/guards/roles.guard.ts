import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { EUserRoles } from 'src/common/interfaces/userRoles.interfaces';
import { GqlExecutionContext } from '@nestjs/graphql';
import { EVariables } from 'src/common/constants/namesVariables';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roleForAccess = this.reflector.get<EUserRoles>(
      EVariables.ROLE,
      context.getHandler(),
    );

    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;
    const user = req.user;

    if (!roleForAccess) {
      req.isExsistRole = false;
      return true;
    }

    /**
     * @info
     * if you need that all needing roles should also be in a user, see it:
     * https://stackoverflow.com/questions/53606337/check-if-array-contains-all-elements-of-another-array
     */
    const isAccess = user.roles.includes(roleForAccess);
    if (!isAccess)
      throw new HttpException(
        "Forbidden, haven't access",
        HttpStatus.FORBIDDEN,
      );

    req.isExsistRole = true;
    return true;
  }
}
