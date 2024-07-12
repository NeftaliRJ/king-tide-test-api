import { cleanEnv, str, port } from 'envalid';
import { ENVIRONMENTS } from './common/constants';

export const env = cleanEnv(process.env, {
  PORT: port(),
  DATABASE_URL: str(),
  NODE_ENV: str({ choices: Object.values(ENVIRONMENTS) }),
  DATABASE_LOG_LEVEL: str({ choices: ['true', 'false'] }),
});
