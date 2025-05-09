# Qubekit - a toolkit for the SonarQube API

Qubekit is a Node.js package that provides an API to facilitate communication
with the SonarQube API, aiding in the communicating with a SonarQube instance
via its web API.

## Overview

Qubekit supports both v1 and v2 of the SonarQube API and generates APIs from
OpenAPI specifications using [hey-api](https://heyapi.dev/openapi-ts/)
generator.

The v1 API is hand-created based on the SonarQueb documentation provided in an
instance. At present only a limited number of endpoints are supported, new
endpoints can be added as needed

The v2 API is automatically generated from the OpenAPI specification provided by
a SonarQube instance.

A wrapper function, `createQubekit`, is provided around these APIs to enable the
easy creation of the client and validation of the required configuration inputs.

## Installation

To install Qubekit, run:

```sh
npm install @philips-software/qubekit
# or
yarn add @philips-software/qubekit
```

## Usage

To create a Qubekit client, use the createQubekit function:

```ts
import { createQubekit } from '@philips-software/qubekit';

const client = createQubekit({
  baseURL: 'https://your-sonarqube-instance.com/api',
  token: 'your-token',
});
```

### Unified API Access

QubeKit provides a unified API that merges the v1 and v2 APIs into a single
interface. This makes your code cleaner and more maintainable:

```ts
// Search for projects
const result = await client.project.searchProjects({
  query: {
    projects: 'project1',
  },
});

// Use user endpoints
const users = await client.user.search();
```

### Method Name Improvements

The SDK automatically cleans method names by removing numeric suffixes. For
example, if the OpenAPI specification defines a method as `search1`, you can
access it as simply `search` in your code.

**Benefits:**

- Cleaner, more intuitive API
- No need to remember numeric suffixes
- Improved code readability

### Type Safety

The SDK provides full TypeScript support with proper type definitions for all
methods and parameters. This ensures you get proper IDE autocompletion and type
checking when using the API.

## Updating the Schema

The SDK is generated from OpenAPI schemas that define the SonarQube API. Both
the v1 and v2 APIs are documented independently. To make changes/additions you
need to update the openapi schemas and then generate the code. The generation
will merge the schemas into a single unified schema.

### API Schemas

**V1 API**

- Located at `src/schema/sonarqube-v1.yaml`
- Hand-crafted based on SonarQube documentation
- Can be edited using the
  [api-fiddle workspace](https://api-fiddle.com/editor/scott-guymers-organization-0xi/sonarqube-v1-api)

**V2 API**

- Located at `src/schema/sonarqube-v2.json`
- Can be obtained from any SonarQube instance at
  `https://your-instance/api/v2/api-docs`

### Merging Schemas

The schemas are merged using the
[OpenAPI Merge](https://www.npmjs.com/package/openapi-merge-cli) tool. This is
automatic as part of the `yarn openapi-ts` command. The
`src/schema/sonarqube-all.yaml` file is the merged schema which the code is
generated from.

### Generating the TypeScript SDK

After updating the schemas, run:

```sh
yarn openapi-ts
```

This will regenerate the SDK with the latest API definitions. The QubeKit
wrapper will automatically:

1. Clean method names by removing numeric suffixes
2. Provide a unified interface to both v1 and v2 APIs
3. Ensure proper TypeScript type definitions

Commit all changes to the repository after regeneration.

## Community

This project uses a [CODE_OF_CONDUCT](./CODE_OF_CONDUCT.md) to define expected
conduct in our community. Instances of abusive, harassing, or otherwise
unacceptable behavior may be reported to the repository administrators by using
the
[Report content](https://docs.github.com/en/communities/maintaining-your-safety-on-github/reporting-abuse-or-spam)
functionality of GitHub.

## Changelog

The changelog is automatically generated from the commits that are squashed into
the main using
[conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) to define
the different impact of changes (features, fixes, etc)

See [CHANGELOG](./CHANGELOG.md) for more info on what's been changed.

## Contributing Guidelines

See [CONTRIBUTING](./CONTRIBUTING.md)

## Licenses

See [LICENSE](./LICENSE)
