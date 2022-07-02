import { RestEndpointMethodTypes } from '@octokit/plugin-rest-endpoint-methods';

export interface GithubUsersCache {
  since: string;
  values: RestEndpointMethodTypes['users']['list']['response'];
  expIn: string;
}
