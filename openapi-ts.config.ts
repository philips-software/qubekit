import { defaultPlugins } from '@hey-api/openapi-ts';

export default {
  experimentalParser: true,
  input: 'src/schema/sonarqube-all.yaml',
  output: {
    format: 'prettier',
    lint: 'eslint',
    path: `src/generated`,
  },
  plugins: [
    ...defaultPlugins,
    { name: '@hey-api/client-fetch', baseUrl: '' },
    '@hey-api/schemas',
    {
      name: '@hey-api/transformers',
      dates: true,
    },
    {
      name: '@hey-api/typescript',
      enums: 'javascript',
      readOnlyWriteOnlyBehavior: 'off',
    },
    {
      name: '@hey-api/sdk',
      asClass: true,
      transformer: true,
    },
  ],
};
