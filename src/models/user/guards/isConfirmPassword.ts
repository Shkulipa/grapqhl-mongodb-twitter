import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql/dist/services/gql-execution-context';

@Injectable()
export class IsConfirmPassword implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;

    const { password, confirmPassword } =
      request.body.variables.createUserInput;

    if (password === confirmPassword) return true;

    throw new HttpException('Passwords is not equal', HttpStatus.BAD_REQUEST);
  }
}
