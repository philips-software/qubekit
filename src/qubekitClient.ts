// This entire file exists because of this limitation: https://github.com/hey-api/openapi-ts/issues/671
// If it becomes possible to internalize the client to an instance of the SDK  then we can remove this
// workaround

import * as sdk from './generated/sdk.gen';
import type { CamelCase } from 'type-fest';
import { Client, createClient } from '@hey-api/client-fetch';

type RemoveServiceSuffix<S extends string | number | symbol> =
  S extends `${infer Prefix}Service` ? Prefix : S;

type RemoveControllerSuffix<S extends string | number | symbol> =
  S extends `${infer Prefix}Controller` ? Prefix : S;

// Type to remove numeric suffixes from method names
type RemoveNumericSuffix<S extends string> = S extends
  | `${infer Prefix}1`
  | `${infer Prefix}2`
  | `${infer Prefix}3`
  | `${infer Prefix}4`
  | `${infer Prefix}5`
  | `${infer Prefix}6`
  | `${infer Prefix}7`
  | `${infer Prefix}8`
  | `${infer Prefix}9`
  ? Prefix
  : S;

export type Qubekit = {
  [Service in keyof typeof sdk as CamelCase<
    RemoveControllerSuffix<RemoveServiceSuffix<Service>>
  >]: {
    [K in keyof (typeof sdk)[Service] as K extends string
      ? // Only include the key if it doesn't have a numeric suffix or if it's the cleaned version
        | (K extends `${string}${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}`
              ? never
              : K)
          | RemoveNumericSuffix<K>
      : K]: (typeof sdk)[Service][K];
  };
};

type QubekitClientOptions = {
  baseUrl: string;
  headers: Record<string, unknown> | undefined;
};

/**
 * This function generates a API that fixes the naming of the services
 * and configures the internal clients to use the correct
 * url and authentication headers without relying on global config.
 *
 * It does a lot of manipulation of the types and SDKs to make the API surface easier
 * to use from the consumer side.
 *
 * @param options The options to configure the API client
 * @returns The API client
 */
export const createQubekitClient = <T extends object, T2 extends object>(
  options: QubekitClientOptions,
): Qubekit => {
  const api: any = {};

  addServices(api, sdk, createClient(options));

  return api as Qubekit;
};

/**
 * Creates a service client by wrapping service class methods
 * @param serviceClass The service class to wrap
 * @param client The client to use for requests
 * @returns A service client with methods that use the provided client
 */
function createServiceClient(
  serviceClass: any,
  client: Client,
): Record<string, any> {
  const serviceClient: Record<string, any> = {};

  // Create methods from the service class
  for (const methodName of Object.getOwnPropertyNames(serviceClass)) {
    if (
      methodName === 'constructor' ||
      typeof serviceClass[methodName] !== 'function'
    ) {
      continue;
    }

    serviceClient[methodName] = (args: any) => {
      return serviceClass[methodName]({
        ...args,
        client,
      });
    };
  }

  return serviceClient;
}

/**
 * Removes numeric suffixes from method names
 * @param serviceClient The original service client
 * @returns A service client with cleaned method names
 */
function cleanMethodNames(
  serviceClient: Record<string, any>,
): Record<string, any> {
  const cleanedClient: Record<string, any> = { ...serviceClient };

  // Process each method to remove numeric suffixes
  for (const methodName in serviceClient) {
    // Skip if not a direct property
    if (!Object.hasOwn(serviceClient, methodName)) continue;

    // Create a clean version by removing numeric suffixes (e.g., search1 -> search)
    const cleanName = methodName.replace(/([a-zA-Z]+)\d+$/, '$1');

    // Only add the clean name if it's different and doesn't already exist
    if (cleanName !== methodName && !cleanedClient[cleanName]) {
      cleanedClient[cleanName] = serviceClient[methodName];
    }
  }

  return cleanedClient;
}

/**
 * Copies the services functions from the services param onto the instance param
 * and sets the client config in each service to the client param
 *
 * @param instance The instance to add services to
 * @param services The services to add
 * @param client The client to use for requests
 */
function addServices<T extends object>(
  instance: any,
  services: T,
  client: Client,
) {
  for (const serviceName in services) {
    if (serviceName === 'default') continue;

    const serviceClass = (services as any)[serviceName];

    // Create the service client with wrapped methods
    const serviceClient = createServiceClient(serviceClass, client);

    // Clean method names by removing numeric suffixes
    const cleanedServiceClient = cleanMethodNames(serviceClient);

    // Convert PascalCase to camelCase for the service name, remove "Service" from name
    const camelCaseServiceName =
      serviceName.charAt(0).toLowerCase() +
      serviceName
        .slice(1)
        .replace(/Service$/, '')
        .replace(/Controller$/, '');

    instance[camelCaseServiceName] = cleanedServiceClient;
  }

  instance.client = client;
}
