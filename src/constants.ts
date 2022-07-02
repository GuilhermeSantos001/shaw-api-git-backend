export const GithubRedisKeys = {
  getUsers: 'github-users',
  getUser: 'github-user',
  getUserRepos: 'github-user-repos',
};

export const RedisOptions = {
  url: process.env.REDIS_ENDPOINT_URI,
  password: process.env.REDIS_PASSWORD,
};
