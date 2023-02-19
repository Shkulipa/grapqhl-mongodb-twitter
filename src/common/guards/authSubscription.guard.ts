import { Injectable, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class GqlAuthGuard {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    // req used in http queries and mutations, connection is used in websocket subscription connections, check AppModule
    const { req, connection } = ctx.getContext();

    // if subscriptions/webSockets, let it pass headers from connection.context to passport-jwt
    return connection && connection.context && connection.context.headers
      ? connection.context
      : req;
  }
}
