import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Octokit } from '@octokit/rest';
import * as parse from 'parse-link-header';
import { BranchDto, RepoDto } from '../dto/repos.dto';
import { SortEnum } from '../enum';

type BranchList = { repo: string; branches: BranchDto[] };

const pageLimit = { page: 1, per_page: 50 };

@Injectable()
export class GitHubProviderService {
  private octokit: Octokit;

  constructor() {
    this.octokit = new Octokit();
  }

  public async listRepos(username: string): Promise<RepoDto[]> {
    try {
      await this.getUser(username);

      const reposMap: Map<string, RepoDto> = new Map();
      const promiseArr: Promise<BranchList>[] = [];
      const q = `user:${username} fork:false`;
      let next: parse.Link = ({ ...pageLimit } as unknown) as parse.Link;

      while (next) {
        const { data, headers = {} } = await this.octokit.search.repos({
          q,
          sort: SortEnum.Updated,
          page: +next.page,
          per_page: +next.per_page,
        });
        const { items = [] } = data;

        items.reduce((acc, v) => {
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
      const message =
        error.status == HttpStatus.NOT_FOUND
          ? `Not fork repositories for user '${username}' are not found`
          : error.message;
      throw new HttpException(message, error.status);
    }
  }

  private async listBranches(owner: string, repo: string): Promise<BranchList> {
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

  private async getUser(username: string): Promise<any> {
    const { data } = await this.octokit.users.getByUsername({
      username,
    });

    return data;
  }
}
