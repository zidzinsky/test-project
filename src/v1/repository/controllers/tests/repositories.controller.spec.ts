import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/common';
import { RepositoriesController } from '../repositories.controller';
import { AppModule } from '../../../../app.module';
import { RepositoriesService } from '../../services/repositories.service';
import { GitHubProviderService } from '../../services/github-provider.service';
import * as Helpers from '../../../../common/helpers';

describe('RepositoriesController', () => {
  let app: TestingModule;
  let controller: RepositoriesController;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [RepositoriesController],
      imports: [AppModule, HttpModule],
      providers: [RepositoriesService, GitHubProviderService],
    })
      .overrideProvider(RepositoriesService)
      .useValue({
        async getRepositories(username: string) {
          return [
            {
              name: 'local-php-security-checker',
              owner: 'fabpot',
              branches: [
                {
                  name: 'main',
                  lastCommit: '556ccf893b9fa364950d422b891510f5338c564b',
                },
              ],
            },
          ];
        },
      })
      .compile();

    controller = app.get<RepositoriesController>(RepositoriesController);
  });

  afterEach(async () => {
    jest.restoreAllMocks();
  });

  describe('getRepositories', () => {
    it('should return data', async () => {
      jest.spyOn(Helpers, 'acceptHeaderValidation').mockImplementation(() => {});

      const username = 'test_user';
      const response = await controller.getRepositories(username);

      expect(response).toBeTruthy();
      expect(Helpers.acceptHeaderValidation).toHaveBeenCalledTimes(1);
    });
  });
});
