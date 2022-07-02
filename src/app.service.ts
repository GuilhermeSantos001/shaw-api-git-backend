import { Injectable } from '@nestjs/common';

import { Github } from './lib/github.lib';

@Injectable()
export class AppService {
  private _isStatusSuccess(status: number) {
    const val = String(status).slice(0, 1);

    return val === '2' || val === '3';
  }

  private _serializerHeaderLink(links: string, route: 'users' | 'repos') {
    return links
      .split(',')
      .map((link) => link.replace(/\s{1,}/g, ''))
      .map((link) => {
        const type = link.match(/\;rel=\"(\w+)\".*$/)[1];

        switch (route) {
          case 'users':
            if (type !== 'first')
              return {
                type,
                page: ((since) => (since ? since[1] : '???'))(
                  link.match(/&since=(\d+).*$/),
                ),
              };
          case 'repos':
            if (type !== 'first')
              return {
                type,
                page: link.match(/\?(since|page)=(\d+).*$/)[2],
              };
        }
      })
      .filter((link) => link);
  }

  async getUser(username: string) {
    try {
      const { data: user, status } = await Github.User(username);

      if (!this._isStatusSuccess(status))
        return new Error(`User not found. Please try again later!`);

      return user;
    } catch {
      return new Error(`Unable to return user. Please try again later!`);
    }
  }

  async getUsers(since: number) {
    try {
      const {
        data: users,
        status,
        headers: { link: links },
      } = await Github.Users(since);

      if (!this._isStatusSuccess(status))
        return new Error(`Unable to return users. Please try again later!`);

      return {
        users: users.map((user) => {
          return {
            id: user.id,
            login: user.login,
            html_url: user.html_url,
            avatar_url: user.avatar_url,
          };
        }),
        pagination: this._serializerHeaderLink(links, 'users'),
        length: users.length,
      };
    } catch {
      return new Error(`Unable to return users. Please try again later!`);
    }
  }

  async getUserRepos(username: string, page?: number) {
    try {
      const {
        data: repos,
        status,
        headers: { link: links },
      } = await Github.Repos(username, page);

      if (!this._isStatusSuccess(status))
        return new Error(`User not found. Please try again later!`);

      return {
        repos,
        pagination: links
          ? this._serializerHeaderLink(links, 'repos')
          : [
              { type: 'next', page: '1' },
              { type: 'last', page: '1' },
            ],
        length: repos.length,
      };
    } catch (error) {
      console.log(error as string);
      return new Error(`Unable to return user. Please try again later!`);
    }
  }
}
