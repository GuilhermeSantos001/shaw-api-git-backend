import { Octokit } from 'octokit';
import { GithubRedisKeys } from '../constants';
import { GithubCacheUsersDB } from '../db/github-cache-users.db';
import { GithubCacheUserDB } from '../db/github-cache-user.db';
import { GithubCacheUserReposDB } from '../db/github-cache-user-repos.db';

export class Github {
  private static _octokit() {
    return new Octokit({ auth: process.env.GITHUB_TOKEN });
  }

  static async Users(since: number) {
    const githubCacheUsersDB = new GithubCacheUsersDB(),
      key = GithubRedisKeys.getUsers,
      users = await githubCacheUsersDB.get(
        key,
        'since',
        since ? `${since}` : 'first',
      );

    if (!users) {
      const values = await this._octokit().rest.users.list({
          per_page: 30,
          since,
        }),
        cache = {
          since: since ? `${since}` : 'first',
          values,
          expIn: '',
        };

      await githubCacheUsersDB.set(
        `${key}-${since ? `${since}` : 'first'}`,
        cache,
      );

      return values;
    }

    return users;
  }

  static async User(username: string) {
    const githubCacheUserDB = new GithubCacheUserDB(),
      key = GithubRedisKeys.getUser,
      user = await githubCacheUserDB.get(key, 'username', username);

    if (!user) {
      const values = await this._octokit().rest.users.getByUsername({
          username,
        }),
        cache = {
          username,
          values,
          expIn: '',
        };

      await githubCacheUserDB.set(`${key}-${username}`, cache);

      return values;
    }

    return user;
  }

  static async Repos(username: string, page?: number) {
    const githubCacheUserReposDB = new GithubCacheUserReposDB(),
      key = GithubRedisKeys.getUserRepos,
      user = await githubCacheUserReposDB.get(
        key,
        'login_and_page',
        `${username}-${page}`,
      );

    if (!user) {
      const values = await this._octokit().rest.repos.listForUser({
          username,
          page,
        }),
        cache = {
          login_and_page: `${username}-${page}`,
          values,
          expIn: '',
        };

      await githubCacheUserReposDB.set(`${key}-${username}-${page}`, cache);

      return values;
    }

    return user;
  }
}
