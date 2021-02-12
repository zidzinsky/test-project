export class OctokitMock {
  public search = {
    repos: () => {
      return {
        headers: {},
        data: {
          items: [repoMock],
        },
      };
    },
  };
}

export const testRepoName = 'test_repo';

export const repoMock = {
  name: testRepoName,
  owner: { login: 'test_user' },
};

export const branchMock = {
  repo: testRepoName,
  branches: [
    {
      name: 'master',
      lastCommit: '1234',
    },
  ],
};
