import { RestEndpointMethodTypes } from '@octokit/plugin-rest-endpoint-methods';

export interface GithubUserReposCache {
  login_and_page: string;
  values: RestEndpointMethodTypes['repos']['listForUser']['response'];
  expIn: string;
}
