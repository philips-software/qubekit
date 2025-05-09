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
});
