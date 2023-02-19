import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLError, GraphQLFormattedError } from 'graphql';
import { mapToLowerCase } from 'src/common/helpers/mapToLowerCase';
import { ConnectionParams } from 'subscriptions-transport-ws';

export const grapqhlConfig: ApolloDriverConfig = {
  driver: ApolloDriver,
  autoSchemaFile: './schema.gql',

  subscriptions: {
    'subscriptions-transport-ws': {
      /**
       * @info
       * https://github.com/nestjs/docs.nestjs.com/issues/394
       * commnt: solidarynetwork commented on Feb 5, 2020 ...
       * there explanation about token for auth subscription,
       * for example it needs in chat subscripton for protect
       * not expected including other users
       */
      onConnect: (connectionParams: ConnectionParams) => {
        // convert header keys to lowercase
        const connectionParamsLowerKeys = mapToLowerCase(connectionParams);

        return {
          headers: connectionParamsLowerKeys.authorization,
        };
      },
    },
  },

  context: ({ req, res, payload, connection }) => ({
    req,
    res,
    payload,
    connection,
  }),

  formatError: (error: GraphQLError) => {
    const code = error.extensions.code;
    const message = error.message;

    if (code === 'INTERNAL_SERVER_ERROR') {
      return {
        ...error,
        message,
      };
    }

    if (code === 'BAD_USER_INPUT') {
      return {
        ...error,
        message,
      };
    }

    if (message === 'VALIDATION_ERROR') {
      const extensions = {
        code: 'VALIDATION_ERROR',
        errors: [],
      };

      Object.keys(error.extensions.invalidArgs).forEach((key) => {
        const constraints = [];
        Object.keys(error.extensions.invalidArgs[key].constraints).forEach(
          (_key) => {
            constraints.push(
              error.extensions.invalidArgs[key].constraints[_key],
            );
          },
        );

        extensions.errors.push({
          field: error.extensions.invalidArgs[key].property,
          errors: constraints,
        });
      });

      const graphQLFormattedError: GraphQLFormattedError = {
        message: 'VALIDATION_ERROR',
        extensions: extensions,
      };

      return graphQLFormattedError;
    }

    return error;
  },
};
