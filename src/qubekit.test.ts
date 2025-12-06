import { createQubekit, ProjectSearchResponse } from './';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

export const server = setupServer();

describe('sonarqubeClient', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it('should throw an error if baseURL is not provided', () => {
    expect(() => createQubekit({ baseURL: '', token: 'token' })).toThrow(
      'baseURL is required',
    );
  });

  it('should make a request to the correct URL', async () => {
    let projectQuery;

    server.use(
      http.get('https://my-instance.com/api/projects/search', ({ request }) => {
        const url = new URL(request.url);
        projectQuery = url.searchParams.get('projects');

        return HttpResponse.json({
          paging: {},
          components: [],
        });
      }),
    );
    const client = createQubekit({
      baseURL: 'https://my-instance.com/api',
      token: 'token',
    });

    // checking that the types are exported correctly
    const result: { data: ProjectSearchResponse | undefined } =
      await client.project.searchProjects({
        query: {
          projects: 'project1',
        },
      });

    expect(result.data).toEqual(
      expect.objectContaining({
        paging: {},
        components: [],
      }),
    );
    expect(projectQuery).toBe('project1');
  });

  it('should make a request with a correct auth header', async () => {
    let header;
    server.use(
      http.get('https://my-instance.com/api/issues/search', ({ request }) => {
        header = request.headers.get('Authorization');
        return HttpResponse.json({});
      }),
    );
    const client = createQubekit({
      baseURL: 'https://my-instance.com/api',
      token: 'token',
    });

    await client.issue.searchIssues();

    expect(header).toBe('Bearer token');
  });

  it('should make a request to the correct URL for v2', async () => {
    server.use(
      http.get('https://my-instance.com/api/v2/users-management/users', () => {
        return HttpResponse.json({
          users: [],
          page: {},
        });
      }),
    );
    const client = createQubekit({
      baseURL: 'https://my-instance.com/api',
      token: 'token',
    });

    const result = await client.user.search();

    expect(result.data).toEqual(
      expect.objectContaining({
        page: {},
        users: [],
      }),
    );
  });

  it('should make a request with a correct auth header for v2', async () => {
    let header;
    server.use(
      http.get(
        'https://my-instance.com/api/v2/users-management/users',
        ({ request }) => {
          header = request.headers.get('Authorization');
          return HttpResponse.json({});
        },
      ),
    );
    const client = createQubekit({
      baseURL: 'https://my-instance.com/api',
      token: 'token',
    });

    await client.user.search();

    expect(header).toBe('Bearer token');
  });

  it('should search for user tokens', async () => {
    let loginParam;
    server.use(
      http.get(
        'https://my-instance.com/api/user_tokens/search',
        ({ request }) => {
          const url = new URL(request.url);
          loginParam = url.searchParams.get('login');
          return HttpResponse.json({
            login: 'testuser',
            userTokens: [
              {
                name: 'test-token',
                createdAt: '2025-01-01T00:00:00+0000',
                type: 'USER_TOKEN',
                lastConnectionDate: '2025-01-15T10:30:00+0000',
                expirationDate: '2026-01-01T00:00:00+0000',
                isExpired: false,
              },
            ],
          });
        },
      ),
    );
    const client = createQubekit({
      baseURL: 'https://my-instance.com/api',
      token: 'token',
    });

    const result = await client.userToken.searchUserTokens({
      query: {
        login: 'testuser',
      },
    });

    expect(result.data).toEqual(
      expect.objectContaining({
        login: 'testuser',
        userTokens: expect.any(Array),
      }),
    );
    expect(result.data?.userTokens[0]).toEqual(
      expect.objectContaining({
        name: 'test-token',
        type: 'USER_TOKEN',
        isExpired: false,
      }),
    );
    expect(loginParam).toBe('testuser');
  });

  it('should generate a user token', async () => {
    let tokenName;
    server.use(
      http.post(
        'https://my-instance.com/api/user_tokens/generate',
        async ({ request }) => {
          const url = new URL(request.url);
          tokenName = url.searchParams.get('name');
          return HttpResponse.json({
            login: 'testuser',
            name: 'new-token',
            token: 'generated-token-value',
            createdAt: '2025-01-01T00:00:00+0000',
            type: 'USER_TOKEN',
          });
        },
      ),
    );
    const client = createQubekit({
      baseURL: 'https://my-instance.com/api',
      token: 'token',
    });

    const result = await client.userToken.generateUserToken({
      query: {
        name: 'new-token',
      },
    });

    expect(result.data).toEqual(
      expect.objectContaining({
        login: 'testuser',
        name: 'new-token',
        token: 'generated-token-value',
        type: 'USER_TOKEN',
      }),
    );
    expect(tokenName).toBe('new-token');
  });

  it('should revoke a user token', async () => {
    let revokedTokenName;
    server.use(
      http.post(
        'https://my-instance.com/api/user_tokens/revoke',
        async ({ request }) => {
          const url = new URL(request.url);
          revokedTokenName = url.searchParams.get('name');
          return new HttpResponse(null, { status: 204 });
        },
      ),
    );
    const client = createQubekit({
      baseURL: 'https://my-instance.com/api',
      token: 'token',
    });

    await client.userToken.revokeUserToken({
      query: {
        name: 'token-to-revoke',
      },
    });

    expect(revokedTokenName).toBe('token-to-revoke');
  });

  it('should search for project analysis tokens with nested project structure', async () => {
    server.use(
      http.get('https://my-instance.com/api/user_tokens/search', () => {
        return HttpResponse.json({
          login: 'testuser',
          userTokens: [
            {
              name: 'project-token',
              createdAt: '2025-01-01T00:00:00+0000',
              type: 'PROJECT_ANALYSIS_TOKEN',
              project: {
                key: 'my-project',
                name: 'My Project',
              },
            },
          ],
        });
      }),
    );
    const client = createQubekit({
      baseURL: 'https://my-instance.com/api',
      token: 'token',
    });

    const result = await client.userToken.searchUserTokens();

    expect(result.data?.userTokens[0]).toEqual(
      expect.objectContaining({
        name: 'project-token',
        type: 'PROJECT_ANALYSIS_TOKEN',
        project: {
          key: 'my-project',
          name: 'My Project',
        },
      }),
    );
  });

  it('should generate a project analysis token', async () => {
    server.use(
      http.post('https://my-instance.com/api/user_tokens/generate', () => {
        return HttpResponse.json({
          login: 'testuser',
          name: 'project-token',
          token: 'generated-project-token',
          createdAt: '2025-01-01T00:00:00+0000',
          type: 'PROJECT_ANALYSIS_TOKEN',
          projectKey: 'my-project',
        });
      }),
    );
    const client = createQubekit({
      baseURL: 'https://my-instance.com/api',
      token: 'token',
    });

    const result = await client.userToken.generateUserToken({
      query: {
        name: 'project-token',
        type: 'PROJECT_ANALYSIS_TOKEN',
        projectKey: 'my-project',
      },
    });

    expect(result.data).toEqual(
      expect.objectContaining({
        name: 'project-token',
        type: 'PROJECT_ANALYSIS_TOKEN',
        projectKey: 'my-project',
      }),
    );
  });

  it('should access ALM Settings endpoints', async () => {
    let almSettingKey;

    server.use(
      http.get('https://my-instance.com/api/alm_settings/list', ({ request }) => {
        const url = new URL(request.url);
        almSettingKey = url.searchParams.get('project');
        return HttpResponse.json({ data: {} });
      }),
    );

    const client = createQubekit({
      baseURL: 'https://my-instance.com/api',
      token: 'token',
    });

    const result = await client.almSettings.listAlmSettings({
      query: {
        project: 'my-project',
      },
    });

    expect(result.data).toEqual({ data: {} });
    expect(almSettingKey).toBe('my-project');
  });

  it('should access Applications endpoints', async () => {
    let applicationKey;

    server.use(
      http.post('https://my-instance.com/api/applications/create', async ({ request }) => {
        const url = new URL(request.url);
        applicationKey = url.searchParams.get('key');
        return HttpResponse.json({ data: {} });
      }),
    );

    const client = createQubekit({
      baseURL: 'https://my-instance.com/api',
      token: 'token',
    });

    const result = await client.applications.createApplication({
      query: {
        key: 'my-app',
        name: 'My Application',
      },
    });

    expect(result.data).toEqual({ data: {} });
    expect(applicationKey).toBe('my-app');
  });

  it('should access ALM Settings binding endpoints', async () => {
    let projectKey;

    server.use(
      http.get('https://my-instance.com/api/alm_settings/get_binding', ({ request }) => {
        const url = new URL(request.url);
        projectKey = url.searchParams.get('project');
        return HttpResponse.json({ data: { almSetting: 'github', repository: 'org/repo' } });
      }),
    );

    const client = createQubekit({
      baseURL: 'https://my-instance.com/api',
      token: 'token',
    });

    const result = await client.almSettings.getAlmBinding({
      query: {
        project: 'my-project',
      },
    });

    expect(result.data).toEqual({ data: { almSetting: 'github', repository: 'org/repo' } });
    expect(projectKey).toBe('my-project');
  });

  it('should access ALM Settings update endpoints', async () => {
    let almKey;

    server.use(
      http.post('https://my-instance.com/api/alm_settings/update_github', async ({ request }) => {
        const url = new URL(request.url);
        almKey = url.searchParams.get('key');
        return HttpResponse.json({ data: {} });
      }),
    );

    const client = createQubekit({
      baseURL: 'https://my-instance.com/api',
      token: 'token',
    });

    const result = await client.almSettings.updateGithubAlmSetting({
      query: {
        key: 'github-prod',
        appId: '12345',
        clientId: 'client_id',
        url: 'https://api.github.com',
      },
    });

    expect(result.data).toEqual({ data: {} });
    expect(almKey).toBe('github-prod');
  });

  it('should access Applications delete endpoint', async () => {
    let applicationKey;

    server.use(
      http.post('https://my-instance.com/api/applications/delete', async ({ request }) => {
        const url = new URL(request.url);
        applicationKey = url.searchParams.get('application');
        return HttpResponse.json({ data: {} });
      }),
    );

    const client = createQubekit({
      baseURL: 'https://my-instance.com/api',
      token: 'token',
    });

    const result = await client.applications.deleteApplication({
      query: {
        application: 'my-app',
      },
    });

    expect(result.data).toEqual({ data: {} });
    expect(applicationKey).toBe('my-app');
  });
});
