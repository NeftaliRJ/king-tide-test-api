import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ProductsModule } from './modules/products/products.module';
import { SharedModule } from './shared/shared.module';
@Module({
  imports: [ProductsModule, SharedModule],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
