# Architecture & Code Generation

Qubekit supports both v1 and v2 of the SonarQube API. To ensure clean and
maintainable code, it provides a single unified interface.

## OpenAPI Schemas

- **v1 API**: Located in `src/schema/sonarqube-v1.yaml`. This is a hand-crafted
  OpenAPI spec since SonarQube only officially documents it in-app.
- **v2 API**: Located in `src/schema/sonarqube-v2.json`. This is the official
  schema that can be retrieved directly from a SonarQube instance.
- **Agent Rule**: Treat `src/schema/` as the source of truth for API
  definitions.

## Schema Merging

- The schemas are merged using the `openapi-merge-cli` tool.
- This process combines them into a single file:
  `src/schema/sonarqube-all.yaml`.

## Code Generation via Hey API

- The SDK client code is generated from the combined schema using
  [Hey API](https://heyapi.dev/openapi-ts/) (`openapi-ts`).
- Run `yarn openapi-ts` to merge the schemas and regenerate the TypeScript SDK.
- **Critical Agent Rule**: Never manually edit the files in the `src/generated/`
  directory. Always modify the source schemas in `src/schema/` and run the
  generation script. Validate generation outputs by running `yarn build` and
  `yarn test` when schema files (`.yaml` or `.json`) are modified.

## SDK Wrapper

- A wrapper function, `createQubekit`, exposes the generated client while also
  performing developer-experience improvements (like stripping trailing numbers
  from method names, so `search1` becomes `search`).
