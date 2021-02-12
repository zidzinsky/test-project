/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Test, TestingModule } from '@nestjs/testing';
import { OctokitMock, repoMock, branchMock } from '../__mocks__/octokit.mock';
import { AppModule } from '../../../../app.module';
import { GitHubProviderService } from '../../services/github-provider.service';

describe('GitHubProviderService', () => {
  let app: TestingModule;
  let service: GitHubProviderService;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [AppModule],
      providers: [GitHubProviderService],
    }).compile();

    service = app.get<GitHubProviderService>(GitHubProviderService);
  });

  afterEach(async () => {
    jest.restoreAllMocks();
  });

  describe('GitHubProviderService.listRepos', () => {
    it('should return repos for the given username', async () => {
      jest.spyOn(service as any, 'getUser').mockImplementation(() => {});
      jest.spyOn(service as any, 'listBranches').mockImplementation(() => {
        return branchMock;
      });

      const username = 'test_user';
      const response = await service.listRepos(username);
      const expected = {
        ...repoMock,
        branches: [...branchMock.branches],
      };
      expect(response).toEqual(expected);
    });
  });
});
