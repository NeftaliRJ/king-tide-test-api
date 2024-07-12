import type { Provider } from '@nestjs/common';
import { Global, Module } from '@nestjs/common';
import { DatabaseService } from './services/database.service';

const providers: Provider[] = [DatabaseService];

@Global()
@Module({
  providers,
  imports: [],
  exports: [...providers],
})
export class SharedModule {}
