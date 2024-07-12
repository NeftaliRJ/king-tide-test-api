import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'PRODUCT_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'product',
          protoPath: join(__dirname, '../../proto/product.proto'),
          url: 'localhost:4000',
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class GrpcModule {}
