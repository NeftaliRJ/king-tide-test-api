import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SharedModule } from './shared/shared.module';
import { OrdersModule } from './modules/orders/orders.module';

@Module({
  imports: [SharedModule, OrdersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
