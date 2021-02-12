export class OctokitMock {
  constructor() {}

  publicsearch = {
    repos: () => {
      return repoMock;
    },
  };
}

export const testRepoName = 'test_repo';

export const repoMock = {
  name: testRepoName,
  owner: 'test_user',
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
