import { describe, it, expect } from 'vitest';
import {
  UserSchema,
  ProfileSchema,
  ArticleSchema,
  CommentSchema,
  LoginRequestSchema,
  RegisterRequestSchema,
  UpdateUserRequestSchema,
  CreateArticleRequestSchema,
  UpdateArticleRequestSchema,
  CreateCommentRequestSchema,
  UserResponseSchema,
  ProfileResponseSchema,
  ArticleResponseSchema,
  ArticlesResponseSchema,
  CommentResponseSchema,
  CommentsResponseSchema,
  TagsResponseSchema,
  ErrorSchema,
  ArticleQuerySchema,
  FeedQuerySchema,
} from '../schemas';

describe('Core Entity Schemas', () => {
  describe('UserSchema', () => {
    it('should validate a valid user object', () => {
      const validUser = {
        email: 'john@example.com',
        token: 'jwt-token-123',
        username: 'john',
        bio: 'Developer from NYC',
        image: 'https://example.com/avatar.jpg',
      };

      const result = UserSchema.parse(validUser);
      expect(result).toEqual(validUser);
    });

    it('should accept null bio and image', () => {
      const userWithNulls = {
        email: 'john@example.com',
        token: 'jwt-token-123',
        username: 'john',
        bio: null,
        image: null,
      };

      const result = UserSchema.parse(userWithNulls);
      expect(result).toEqual(userWithNulls);
    });

    it('should reject invalid email', () => {
      const invalidUser = {
        email: 'invalid-email',
        token: 'jwt-token-123',
        username: 'john',
        bio: null,
        image: null,
      };

      expect(() => UserSchema.parse(invalidUser)).toThrow();
    });
  });

  describe('ProfileSchema', () => {
    it('should validate a valid profile object', () => {
      const validProfile = {
        username: 'john',
        bio: 'Developer from NYC',
        image: 'https://example.com/avatar.jpg',
        following: true,
      };

      const result = ProfileSchema.parse(validProfile);
      expect(result).toEqual(validProfile);
    });

    it('should accept null bio and image', () => {
      const profileWithNulls = {
        username: 'john',
        bio: null,
        image: null,
        following: false,
      };

      const result = ProfileSchema.parse(profileWithNulls);
      expect(result).toEqual(profileWithNulls);
    });
  });

  describe('ArticleSchema', () => {
    it('should validate a valid article object', () => {
      const validArticle = {
        slug: 'how-to-train-your-dragon',
        title: 'How to train your dragon',
        description: 'Ever wonder how?',
        body: 'Very carefully.',
        tagList: ['dragons', 'training'],
        createdAt: '2016-02-18T03:22:56.637Z',
        updatedAt: '2016-02-18T03:48:35.824Z',
        favorited: false,
        favoritesCount: 0,
        author: {
          username: 'jake',
          bio: 'I work at statefarm',
          image: 'https://i.stack.imgur.com/xHWG8.jpg',
          following: false,
        },
      };

      const result = ArticleSchema.parse(validArticle);
      expect(result).toEqual(validArticle);
    });

    it('should accept empty tag list', () => {
      const articleWithEmptyTags = {
        slug: 'test-article',
        title: 'Test Article',
        description: 'Test description',
        body: 'Test body',
        tagList: [],
        createdAt: '2016-02-18T03:22:56.637Z',
        updatedAt: '2016-02-18T03:48:35.824Z',
        favorited: false,
        favoritesCount: 0,
        author: {
          username: 'jake',
          bio: null,
          image: null,
          following: false,
        },
      };

      const result = ArticleSchema.parse(articleWithEmptyTags);
      expect(result).toEqual(articleWithEmptyTags);
    });
  });

  describe('CommentSchema', () => {
    it('should validate a valid comment object', () => {
      const validComment = {
        id: 1,
        createdAt: '2016-02-18T03:22:56.637Z',
        updatedAt: '2016-02-18T03:22:56.637Z',
        body: 'It takes a Jacobian',
        author: {
          username: 'jake',
          bio: 'I work at statefarm',
          image: 'https://i.stack.imgur.com/xHWG8.jpg',
          following: false,
        },
      };

      const result = CommentSchema.parse(validComment);
      expect(result).toEqual(validComment);
    });
  });
});

describe('Request Schemas', () => {
  describe('LoginRequestSchema', () => {
    it('should validate a valid login request', () => {
      const validRequest = {
        user: {
          email: 'john@example.com',
          password: 'password123',
        },
      };

      const result = LoginRequestSchema.parse(validRequest);
      expect(result).toEqual(validRequest);
    });

    it('should reject empty password', () => {
      const invalidRequest = {
        user: {
          email: 'john@example.com',
          password: '',
        },
      };

      expect(() => LoginRequestSchema.parse(invalidRequest)).toThrow();
    });

    it('should reject invalid email format', () => {
      const invalidRequest = {
        user: {
          email: 'not-an-email',
          password: 'password123',
        },
      };

      expect(() => LoginRequestSchema.parse(invalidRequest)).toThrow();
    });
  });

  describe('RegisterRequestSchema', () => {
    it('should validate a valid registration request', () => {
      const validRequest = {
        user: {
          username: 'john',
          email: 'john@example.com',
          password: 'password123',
        },
      };

      const result = RegisterRequestSchema.parse(validRequest);
      expect(result).toEqual(validRequest);
    });

    it('should reject empty username', () => {
      const invalidRequest = {
        user: {
          username: '',
          email: 'john@example.com',
          password: 'password123',
        },
      };

      expect(() => RegisterRequestSchema.parse(invalidRequest)).toThrow();
    });
  });

  describe('CreateArticleRequestSchema', () => {
    it('should validate a valid article creation request', () => {
      const validRequest = {
        article: {
          title: 'How to train your dragon',
          description: 'Ever wonder how?',
          body: 'Very carefully.',
          tagList: ['dragons', 'training'],
        },
      };

      const result = CreateArticleRequestSchema.parse(validRequest);
      expect(result).toEqual(validRequest);
    });

    it('should accept optional tagList', () => {
      const requestWithoutTags = {
        article: {
          title: 'How to train your dragon',
          description: 'Ever wonder how?',
          body: 'Very carefully.',
        },
      };

      const result = CreateArticleRequestSchema.parse(requestWithoutTags);
      expect(result).toEqual(requestWithoutTags);
    });

    it('should reject empty title', () => {
      const invalidRequest = {
        article: {
          title: '',
          description: 'Ever wonder how?',
          body: 'Very carefully.',
        },
      };

      expect(() => CreateArticleRequestSchema.parse(invalidRequest)).toThrow();
    });
  });

  describe('CreateCommentRequestSchema', () => {
    it('should validate a valid comment creation request', () => {
      const validRequest = {
        comment: {
          body: 'His name was my name too.',
        },
      };

      const result = CreateCommentRequestSchema.parse(validRequest);
      expect(result).toEqual(validRequest);
    });

    it('should reject empty comment body', () => {
      const invalidRequest = {
        comment: {
          body: '',
        },
      };

      expect(() => CreateCommentRequestSchema.parse(invalidRequest)).toThrow();
    });
  });
});

describe('Response Schemas', () => {
  describe('UserResponseSchema', () => {
    it('should validate a valid user response', () => {
      const validResponse = {
        user: {
          email: 'john@example.com',
          token: 'jwt-token-123',
          username: 'john',
          bio: 'Developer from NYC',
          image: 'https://example.com/avatar.jpg',
        },
      };

      const result = UserResponseSchema.parse(validResponse);
      expect(result).toEqual(validResponse);
    });
  });

  describe('ArticlesResponseSchema', () => {
    it('should validate a valid articles response', () => {
      const validResponse = {
        articles: [
          {
            slug: 'how-to-train-your-dragon',
            title: 'How to train your dragon',
            description: 'Ever wonder how?',
            body: 'Very carefully.',
            tagList: ['dragons', 'training'],
            createdAt: '2016-02-18T03:22:56.637Z',
            updatedAt: '2016-02-18T03:48:35.824Z',
            favorited: false,
            favoritesCount: 0,
            author: {
              username: 'jake',
              bio: 'I work at statefarm',
              image: 'https://i.stack.imgur.com/xHWG8.jpg',
              following: false,
            },
          },
        ],
        articlesCount: 1,
      };

      const result = ArticlesResponseSchema.parse(validResponse);
      expect(result).toEqual(validResponse);
    });

    it('should accept empty articles array', () => {
      const emptyResponse = {
        articles: [],
        articlesCount: 0,
      };

      const result = ArticlesResponseSchema.parse(emptyResponse);
      expect(result).toEqual(emptyResponse);
    });
  });

  describe('TagsResponseSchema', () => {
    it('should validate a valid tags response', () => {
      const validResponse = {
        tags: ['reactjs', 'angularjs', 'dragons'],
      };

      const result = TagsResponseSchema.parse(validResponse);
      expect(result).toEqual(validResponse);
    });

    it('should accept empty tags array', () => {
      const emptyResponse = {
        tags: [],
      };

      const result = TagsResponseSchema.parse(emptyResponse);
      expect(result).toEqual(emptyResponse);
    });
  });
});

describe('Error Schema', () => {
  describe('ErrorSchema', () => {
    it('should validate a valid error response', () => {
      const validError = {
        errors: {
          body: ['can\'t be empty'],
          email: ['can\'t be blank', 'is invalid'],
        },
      };

      const result = ErrorSchema.parse(validError);
      expect(result).toEqual(validError);
    });

    it('should accept empty errors object', () => {
      const emptyError = {
        errors: {},
      };

      const result = ErrorSchema.parse(emptyError);
      expect(result).toEqual(emptyError);
    });
  });
});

describe('Query Parameter Schemas', () => {
  describe('ArticleQuerySchema', () => {
    it('should validate valid query parameters', () => {
      const validQuery = {
        tag: 'dragons',
        author: 'jake',
        favorited: 'john',
        limit: 10,
        offset: 0,
      };

      const result = ArticleQuerySchema.parse(validQuery);
      expect(result).toEqual(validQuery);
    });

    it('should accept partial query parameters', () => {
      const partialQuery = {
        tag: 'dragons',
        limit: 5,
      };

      const result = ArticleQuerySchema.parse(partialQuery);
      expect(result).toEqual({
        tag: 'dragons',
        limit: 5,
        offset: 0, // Default value is applied
      });
    });

    it('should apply default values for limit and offset', () => {
      const queryWithDefaults = {};

      const result = ArticleQuerySchema.parse(queryWithDefaults);
      expect(result.limit).toBe(20);
      expect(result.offset).toBe(0);
    });

    it('should enforce limit constraints', () => {
      const invalidQuery = {
        limit: 150, // over max of 100
      };

      expect(() => ArticleQuerySchema.parse(invalidQuery)).toThrow();
    });

    it('should coerce string numbers to numbers', () => {
      const queryWithStringNumbers = {
        limit: '15',
        offset: '5',
      };

      const result = ArticleQuerySchema.parse(queryWithStringNumbers);
      expect(result.limit).toBe(15);
      expect(result.offset).toBe(5);
    });
  });

  describe('FeedQuerySchema', () => {
    it('should validate valid feed query parameters', () => {
      const validQuery = {
        limit: 10,
        offset: 5,
      };

      const result = FeedQuerySchema.parse(validQuery);
      expect(result).toEqual(validQuery);
    });

    it('should apply default values', () => {
      const emptyQuery = {};

      const result = FeedQuerySchema.parse(emptyQuery);
      expect(result.limit).toBe(20);
      expect(result.offset).toBe(0);
    });
  });
});