import { Module, HttpModule } from '@nestjs/common';
import { RepositoriesController } from './controllers/repositories.controller';
import { VersionControlProviderEnum } from './enum';
import { GitHubProviderService } from './services/github-provider.service';
import { RepositoriesService } from './services/repositories.service';

@Module({
  imports: [HttpModule],
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
