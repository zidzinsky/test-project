import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RepositoriesModule } from './v1/repository/repositories.module';

@Module({
  imports: [ConfigModule.forRoot(), RepositoriesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
