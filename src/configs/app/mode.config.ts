import * as Joi from 'joi';
import { ConfigModuleOptions } from '@nestjs/config/dist/interfaces/config-module-options.interface';

const ENV = process.env.NODE_ENV;

export const modeConfig: ConfigModuleOptions = {
  envFilePath: !ENV ? '.env' : `.env.${ENV}`,

  validationSchema: Joi.object({
    NODE_ENV: Joi.string().valid('production', 'development', 'local'),
    PORT: Joi.number().required(),

    MONGODB_URL: Joi.string().required(),

    SECRET_ACCESS: Joi.string().required(),
    SECRET_REFRESH: Joi.string().required(),
  }),

  validationOptions: {
    abortEarly: true,
  },
};
