import { HttpException, Injectable } from '@nestjs/common';
import { Octokit } from '@octokit/rest';
import { Endpoints } from '@octokit/types';
import * as parse from 'parse-link-header';
import { BranchDto, RepoDto } from '../dto/repos.dto';
import { SortEnum } from '../enum';

type listUserReposResponse = Endpoints['GET /repos/{owner}/{repo}']['response'];
type BranchList = { repo: string; branches: BranchDto[] };

const pageLimit = { page: 1, per_page: 50 };

@Injectable()
export class GitHubProviderService {
  private octokit: Octokit;

  constructor() {
    this.octokit = new Octokit();
  }

  public async listRepos(username): Promise<RepoDto[]> {
    try {
      const reposMap: Map<string, RepoDto> = new Map();
      const promiseArr: Promise<BranchList>[] = [];
      let next: parse.Link = ({ ...pageLimit } as unknown) as parse.Link;

      while (next) {
        const { data = [], headers = {} } = await this.octokit.repos.listForUser({
          username,
          sort: SortEnum.Updated,
          page: +next.page,
          per_page: +next.per_page,
        });

        data
          .filter((v) => !v.fork)
          .reduce((acc, v) => {
            promiseArr.push(this.listBranches(v.owner.login, v.name));

            acc.set(v.name, {
              name: v.name,
              owner: v.owner.login,
              branches: [],
            });
            return acc;
          }, reposMap);

        const parsedLink: parse.Links = parse(headers['link']);
        next = parsedLink?.next;
      }

      const branches: BranchList[] = await Promise.all(promiseArr);

      branches.forEach((item) => {
        const repo: RepoDto = reposMap.get(item.repo);
        repo.branches = [...item.branches];
      });

      return [...reposMap.values()];
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  public async listBranches(owner: string, repo: string): Promise<BranchList> {
    const branchList: BranchDto[] = [];
    let next: parse.Link = ({ ...pageLimit } as unknown) as parse.Link;

    while (next) {
      const { data = [], headers } = await this.octokit.repos.listBranches({
        owner,
        repo,
        page: +next.page,
        per_page: +next.per_page,
      });

      const branches: BranchDto[] = data.map((v) => {
        return {
          name: v.name,
          lastCommit: v.commit.sha,
        };
      });

      branchList.push(...branches);

      const parsedLink: parse.Links = parse(headers['link']);
      next = parsedLink?.next;
    }

    return {
      repo,
      branches: branchList,
    };
  }
}
