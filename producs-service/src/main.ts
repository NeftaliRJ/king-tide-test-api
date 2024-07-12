import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { env } from './env';

async function bootstrap() {
  dotenv.config();

  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'product',
      protoPath: join(__dirname, 'proto/product.proto'),
      url: 'localhost:5000',
    },
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  await app.startAllMicroservices();
  const port = env.PORT;
  await app.listen(port);
}
bootstrap();
