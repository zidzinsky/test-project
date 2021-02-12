import { Module } from '@nestjs/common';
import { RepositoriesController } from './controllers/repositories.controller';
import { GitHubProviderService } from './services/github-provider.service';
import { RepositoriesService } from './services/repositories.service';
@Module({
  controllers: [RepositoriesController],
  providers: [
    {
      provide: 'VersionControlProvider',
      useFactory: () => process.env.NODE_ENV,
    },
    RepositoriesService,
    GitHubProviderService,
  ],
})
export class RepositoriesModule {}
