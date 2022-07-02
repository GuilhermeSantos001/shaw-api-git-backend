import { GithubUsersCache } from '../interfaces/github-users-cache.interface';

import { Redis } from '../lib/redis.lib';
import { StringEx } from '../lib/string-ex.lib';

export class GithubCacheUsersDB {
  async get(key: string, pattern: string, target: string) {
    const caches = await Redis.All(`${key}-*`),
      now = new Date();

    if (!(caches instanceof Error) && caches.length > 0) {
      const filter = caches
        .map((text) => StringEx.Decompress(text) as GithubUsersCache)
        .filter((user) => user[pattern] === target);

      if (filter.length > 0) {
        const data = filter.find(async (user) => {
          if (new Date(user.expIn) > now) return user;

          return null;
        });

        if (data) return data.values;
      }
    }

    return null;
  }

  async set(key: string, cache: GithubUsersCache): Promise<string | Error> {
    const expIn = new Date();

    expIn.setMinutes(expIn.getMinutes() + 5);

    return await Redis.Save(
      key,
      StringEx.Compress(
        JSON.stringify({
          ...cache,
          expIn: expIn.toISOString(),
        }),
      ),
    );
  }
}
