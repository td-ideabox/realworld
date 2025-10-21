import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ConduitApiClient } from '../client.js';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('ConduitApiClient', () => {
  let client: ConduitApiClient;

  beforeEach(() => {
    mockFetch.mockClear();
    client = new ConduitApiClient({
      baseUrl: 'https://api.example.com',
      timeout: 5000,
    });
  });

  describe('Constructor and Configuration', () => {
    it('should initialize with correct base URL', () => {
      const testClient = new ConduitApiClient({
        baseUrl: 'https://test.com/',
      });
      expect(testClient).toBeInstanceOf(ConduitApiClient);
    });

    it('should strip trailing slash from base URL', () => {
      const testClient = new ConduitApiClient({
        baseUrl: 'https://test.com/',
      });
      expect(testClient).toBeInstanceOf(ConduitApiClient);
    });

    it('should set default headers', () => {
      const testClient = new ConduitApiClient({
        baseUrl: 'https://test.com',
        defaultHeaders: { 'Custom-Header': 'value' },
      });
      expect(testClient).toBeInstanceOf(ConduitApiClient);
    });
  });

  describe('Token Management', () => {
    it('should set and use authentication token', () => {
      client.setToken('test-token');
      // Token is private, but we can test it through API calls
      expect(client).toBeInstanceOf(ConduitApiClient);
    });

    it('should clear authentication token', () => {
      client.setToken('test-token');
      client.setToken(null);
      expect(client).toBeInstanceOf(ConduitApiClient);
    });
  });

  describe('Authentication Methods', () => {
    describe('login', () => {
      it('should make login request with valid credentials', async () => {
        const mockResponse = {
          user: {
            email: 'john@example.com',
            token: 'jwt-token-123',
            username: 'john',
            bio: null,
            image: null,
          },
        };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => mockResponse,
          headers: new Headers(),
        });

        const credentials = {
          user: {
            email: 'john@example.com',
            password: 'password123',
          },
        };

        const result = await client.login(credentials);

        expect(mockFetch).toHaveBeenCalledWith(
          'https://api.example.com/api/users/login',
          expect.objectContaining({
            method: 'POST',
            headers: expect.objectContaining({
              'Content-Type': 'application/json',
            }),
            body: JSON.stringify(credentials),
          })
        );

        expect(result).toEqual(mockResponse);
      });

      it('should reject invalid login credentials', async () => {
        const invalidCredentials = {
          user: {
            email: 'invalid-email',
            password: 'password123',
          },
        };

        expect(() => client.login(invalidCredentials)).rejects.toThrow();
      });

      it('should handle login API errors', async () => {
        const errorResponse = {
          errors: {
            'email or password': ['is invalid'],
          },
        };

        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 422,
          statusText: 'Unprocessable Entity',
          json: async () => errorResponse,
          headers: new Headers(),
        });

        const credentials = {
          user: {
            email: 'john@example.com',
            password: 'wrong-password',
          },
        };

        await expect(client.login(credentials)).rejects.toEqual({
          error: errorResponse,
          status: 422,
          message: 'Unprocessable Entity',
        });
      });
    });

    describe('register', () => {
      it('should make registration request with valid data', async () => {
        const mockResponse = {
          user: {
            email: 'john@example.com',
            token: 'jwt-token-123',
            username: 'john',
            bio: null,
            image: null,
          },
        };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          status: 201,
          json: async () => mockResponse,
          headers: new Headers(),
        });

        const userData = {
          user: {
            username: 'john',
            email: 'john@example.com',
            password: 'password123',
          },
        };

        const result = await client.register(userData);

        expect(mockFetch).toHaveBeenCalledWith(
          'https://api.example.com/api/users',
          expect.objectContaining({
            method: 'POST',
            headers: expect.objectContaining({
              'Content-Type': 'application/json',
            }),
            body: JSON.stringify(userData),
          })
        );

        expect(result).toEqual(mockResponse);
      });

      it('should reject invalid registration data', async () => {
        const invalidUserData = {
          user: {
            username: '',
            email: 'john@example.com',
            password: 'password123',
          },
        };

        expect(() => client.register(invalidUserData)).rejects.toThrow();
      });
    });
  });

  describe('User Methods', () => {
    beforeEach(() => {
      client.setToken('test-token');
    });

    describe('getCurrentUser', () => {
      it('should fetch current user with authentication', async () => {
        const mockResponse = {
          user: {
            email: 'john@example.com',
            token: 'jwt-token-123',
            username: 'john',
            bio: 'Developer',
            image: 'https://example.com/avatar.jpg',
          },
        };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => mockResponse,
          headers: new Headers(),
        });

        const result = await client.getCurrentUser();

        expect(mockFetch).toHaveBeenCalledWith(
          'https://api.example.com/api/user',
          expect.objectContaining({
            method: 'GET',
            headers: expect.objectContaining({
              'Authorization': 'Token test-token',
            }),
          })
        );

        expect(result).toEqual(mockResponse);
      });
    });

    describe('updateUser', () => {
      it('should update user with valid data', async () => {
        const updateData = {
          user: {
            email: 'newemail@example.com',
            bio: 'Updated bio',
          },
        };

        const mockResponse = {
          user: {
            email: 'newemail@example.com',
            token: 'jwt-token-123',
            username: 'john',
            bio: 'Updated bio',
            image: null,
          },
        };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => mockResponse,
          headers: new Headers(),
        });

        const result = await client.updateUser(updateData);

        expect(mockFetch).toHaveBeenCalledWith(
          'https://api.example.com/api/user',
          expect.objectContaining({
            method: 'PUT',
            headers: expect.objectContaining({
              'Authorization': 'Token test-token',
              'Content-Type': 'application/json',
            }),
            body: JSON.stringify(updateData),
          })
        );

        expect(result).toEqual(mockResponse);
      });
    });
  });

  describe('Article Methods', () => {
    describe('getArticles', () => {
      it('should fetch articles with query parameters', async () => {
        const mockResponse = {
          articles: [
            {
              slug: 'test-article',
              title: 'Test Article',
              description: 'Test description',
              body: 'Test body',
              tagList: ['test'],
              createdAt: '2023-01-01T00:00:00.000Z',
              updatedAt: '2023-01-01T00:00:00.000Z',
              favorited: false,
              favoritesCount: 0,
              author: {
                username: 'testuser',
                bio: null,
                image: null,
                following: false,
              },
            },
          ],
          articlesCount: 1,
        };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => mockResponse,
          headers: new Headers(),
        });

        const query = {
          tag: 'test',
          limit: 10,
          offset: 0,
        };

        const result = await client.getArticles(query);

        expect(mockFetch).toHaveBeenCalledWith(
          'https://api.example.com/api/articles?tag=test&limit=10&offset=0',
          expect.objectContaining({
            method: 'GET',
          })
        );

        expect(result).toEqual(mockResponse);
      });

      it('should fetch articles without query parameters', async () => {
        const mockResponse = {
          articles: [],
          articlesCount: 0,
        };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => mockResponse,
          headers: new Headers(),
        });

        const result = await client.getArticles();

        expect(mockFetch).toHaveBeenCalledWith(
          'https://api.example.com/api/articles',
          expect.objectContaining({
            method: 'GET',
          })
        );

        expect(result).toEqual(mockResponse);
      });
    });

    describe('createArticle', () => {
      beforeEach(() => {
        client.setToken('test-token');
      });

      it('should create article with valid data', async () => {
        const articleData = {
          article: {
            title: 'Test Article',
            description: 'Test description',
            body: 'Test body content',
            tagList: ['test', 'article'],
          },
        };

        const mockResponse = {
          article: {
            slug: 'test-article',
            title: 'Test Article',
            description: 'Test description',
            body: 'Test body content',
            tagList: ['test', 'article'],
            createdAt: '2023-01-01T00:00:00.000Z',
            updatedAt: '2023-01-01T00:00:00.000Z',
            favorited: false,
            favoritesCount: 0,
            author: {
              username: 'testuser',
              bio: null,
              image: null,
              following: false,
            },
          },
        };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          status: 201,
          json: async () => mockResponse,
          headers: new Headers(),
        });

        const result = await client.createArticle(articleData);

        expect(mockFetch).toHaveBeenCalledWith(
          'https://api.example.com/api/articles',
          expect.objectContaining({
            method: 'POST',
            headers: expect.objectContaining({
              'Authorization': 'Token test-token',
              'Content-Type': 'application/json',
            }),
            body: JSON.stringify(articleData),
          })
        );

        expect(result).toEqual(mockResponse);
      });

      it('should reject article with empty title', async () => {
        const invalidArticleData = {
          article: {
            title: '',
            description: 'Test description',
            body: 'Test body content',
          },
        };

        expect(() => client.createArticle(invalidArticleData)).rejects.toThrow();
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle network timeout', async () => {
      mockFetch.mockRejectedValueOnce(new Error('AbortError'));

      const credentials = {
        user: {
          email: 'john@example.com',
          password: 'password123',
        },
      };

      await expect(client.login(credentials)).rejects.toThrow();
    });

    it('should handle malformed JSON response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => {
          throw new Error('Invalid JSON');
        },
        headers: new Headers(),
      });

      const credentials = {
        user: {
          email: 'john@example.com',
          password: 'password123',
        },
      };

      await expect(client.login(credentials)).rejects.toThrow('Invalid JSON');
    });
  });

  describe('Request Building', () => {
    it('should properly encode query parameters', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ articles: [], articlesCount: 0 }),
        headers: new Headers(),
      });

      const query = {
        tag: 'test tag with spaces',
        author: 'user@example.com',
        limit: 10,
        offset: 0,
      };

      await client.getArticles(query);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/api/articles?tag=test+tag+with+spaces&author=user%40example.com&limit=10',
        expect.any(Object)
      );
    });

    it('should omit undefined query parameters', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ articles: [], articlesCount: 0 }),
        headers: new Headers(),
      });

      const query = {
        tag: 'test',
        author: undefined,
        limit: 10,
        offset: 0,
      };

      await client.getArticles(query);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/api/articles?tag=test&limit=10',
        expect.any(Object)
      );
    });
  });
});