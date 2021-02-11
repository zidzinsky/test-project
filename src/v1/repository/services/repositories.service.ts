import { Injectable, Inject } from '@nestjs/common';
import { GitHubProviderService } from './github-provider.service';
import { VersionControlProviderEnum } from '../enum';
import { RepoDto } from '../dto/repos.dto';

@Injectable()
export class RepositoriesService {
  constructor(
    private readonly gitHubService: GitHubProviderService,
    @Inject('VersionControlProvider')
    private versionControlProvider: VersionControlProviderEnum
  ) {}

  public async getRepositories(username: string): Promise<RepoDto[]> {
    switch (this.versionControlProvider) {
      case VersionControlProviderEnum.GitLab:
        //TODO
        return;
      case VersionControlProviderEnum.GitHub:
      default:
        return this.gitHubService.listRepos(username);
    }
  }
}
