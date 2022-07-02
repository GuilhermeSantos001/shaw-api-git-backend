import { RestEndpointMethodTypes } from '@octokit/plugin-rest-endpoint-methods';

export interface GithubUserCache {
  username: string;
  values: RestEndpointMethodTypes['users']['getByUsername']['response'];
  expIn: string;
}
