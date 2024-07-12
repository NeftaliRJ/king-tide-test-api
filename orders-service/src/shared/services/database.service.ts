import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { env } from '@/env';
import { ENVIRONMENTS } from '@/common/constants';

@Injectable()
export class DatabaseService
  extends PrismaClient<Prisma.PrismaClientOptions, Prisma.LogLevel>
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(DatabaseService.name);
  constructor() {
    super({
      log:
        env.DATABASE_LOG_LEVEL === 'true' &&
        env.NODE_ENV !== ENVIRONMENTS.PRODUCTION
          ? [
              {
                emit: 'event',
                level: 'error',
              },
              {
                emit: 'event',
                level: 'warn',
              },
              {
                emit: 'event',
                level: 'info',
              },
              {
                emit: 'event',
                level: 'query',
              },
            ]
          : [
              {
                emit: 'event',
                level: 'error',
              },
              {
                emit: 'event',
                level: 'warn',
              },
            ],
    });
  }

  async onModuleInit() {
    await this.$connect();

    this.$on('error', (e) => {
      this.logger.error({
        message: 'Error prisma executed',
        prismaMessage: e?.message,
        target: e?.target,
        timestamp: e?.timestamp,
      });
    });
    this.$on('warn', (e) => {
      this.logger.warn({
        message: 'Warn prisma executed',
        prismaMessage: e?.message,
        target: e?.target,
        timestamp: e?.timestamp,
      });
    });
    this.$on('info', (e) => {
      this.logger.log({
        message: 'Info prisma executed',
        prismaMessage: e?.message,
        params: e?.target,
        duration: e?.timestamp,
      });
    });
    this.$on('query', (e) => {
      this.logger.log({
        message: 'Query executed',
        query: e?.query,
        params: e?.params,
        duration: e?.duration + 'ms',
      });
    });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
