import { Module } from '@nestjs/common';
import { RepositoriesController } from './controllers/repositories.controller';
import { VersionControlProviderEnum } from './enum';
import { GitHubProviderService } from './services/github-provider.service';
import { RepositoriesService } from './services/repositories.service';

@Module({
  controllers: [RepositoriesController],
  providers: [
    {
      provide: 'VersionControlProvider',
      useValue: VersionControlProviderEnum.GitHub,
    },
    RepositoriesService,
    GitHubProviderService,
  ],
})
export class RepositoriesModule {}
