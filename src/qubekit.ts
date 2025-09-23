import { createQubekitClient } from './qubekitClient';

export type QubekitOptions = {
  /**
   * The base URL of the SonarQube instance, without the version segment
   */
  baseURL: string;
  /**
   * The authentication token for the SonarQube instance
   */
  token: string;
  /**
   * Additional headers to be sent with all requests
   */
  headers?: Record<string, unknown>;
};

/**
 * Create a sonarqube client that can be used with both v1 and v2
 * endpoints.
 *
 * @param options The required options to create a sonarqube client
 * @returns
 */
export const createQubekit = (options: QubekitOptions) => {
  // validate that the baseurl is present, and is a valid url and is https, if not then throw an error
  if (!options.baseURL) {
    throw new Error('baseURL is required');
  }

  //validate tha baseurl is a valid url using the URL library
  try {
    new URL(options.baseURL);
  } catch (error) {
    throw new Error('baseURL is not a valid URL');
  }

  //validate that the url is https
  if (!options.baseURL.startsWith('https')) {
    throw new Error('baseURL should be https');
  }

  if (!options.token) {
    throw new Error('token is required');
  }
  return createQubekitClient({
    baseUrl: options.baseURL,
    headers: {
      Authorization: `Bearer ${options.token}`,
      ...options.headers,
    },
  });
};
