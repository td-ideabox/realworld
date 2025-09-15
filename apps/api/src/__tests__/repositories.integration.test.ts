import { describe, it, expect, beforeEach } from 'vitest';
import "reflect-metadata";
import { container } from "../container.js";
import {
  IUserRepository,
  IArticleRepository,
  ICommentRepository,
  ITagRepository,
  IFavoriteRepository,
  IFollowRepository
} from "../repositories/index.js";
import { IDatabaseService } from "../services/database.service.js";

describe('Repository Integration Tests', () => {
  let databaseService: IDatabaseService;
  let userRepository: IUserRepository;
  let articleRepository: IArticleRepository;
  let commentRepository: ICommentRepository;
  let tagRepository: ITagRepository;
  let favoriteRepository: IFavoriteRepository;
  let followRepository: IFollowRepository;

  beforeEach(async () => {
    // Get singleton instances - all should share the same DatabaseService
    databaseService = container.resolve<IDatabaseService>("IDatabaseService");
    userRepository = container.resolve<IUserRepository>("IUserRepository");
    articleRepository = container.resolve<IArticleRepository>("IArticleRepository");
    commentRepository = container.resolve<ICommentRepository>("ICommentRepository");
    tagRepository = container.resolve<ITagRepository>("ITagRepository");
    favoriteRepository = container.resolve<IFavoriteRepository>("IFavoriteRepository");
    followRepository = container.resolve<IFollowRepository>("IFollowRepository");

    // Reset database to fresh state for each test (preserving singleton instances)
    await databaseService.reset();
  });

  describe('User Repository', () => {
    it('should create and retrieve a user', async () => {
      const userData = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'hashedpassword',
        bio: 'Test bio',
        image: 'https://example.com/avatar.jpg'
      };

      const user = await userRepository.create(userData);

      expect(user).toBeDefined();
      expect(user.id).toBeDefined();
      expect(user.email).toBe(userData.email);
      expect(user.username).toBe(userData.username);

      // Test finding by ID
      const foundById = await userRepository.findById(user.id);
      expect(foundById).toBeDefined();
      expect(foundById?.email).toBe(userData.email);

      // Test finding by email
      const foundByEmail = await userRepository.findByEmail(userData.email);
      expect(foundByEmail).toBeDefined();
      expect(foundByEmail?.username).toBe(userData.username);

      // Test finding by username
      const foundByUsername = await userRepository.findByUsername(userData.username);
      expect(foundByUsername).toBeDefined();
      expect(foundByUsername?.email).toBe(userData.email);
    });

    it('should update user information', async () => {
      const user = await userRepository.create({
        email: 'update@example.com',
        username: 'updateuser',
        password: 'password',
      });

      const updatedUser = await userRepository.update(user.id, {
        bio: 'Updated bio',
        image: 'https://example.com/new-avatar.jpg'
      });

      expect(updatedUser).toBeDefined();
      expect(updatedUser?.bio).toBe('Updated bio');
      expect(updatedUser?.image).toBe('https://example.com/new-avatar.jpg');
    });
  });

  describe('Tag Repository', () => {
    it('should create and retrieve tags', async () => {
      const tag = await tagRepository.create({ name: 'javascript' });

      expect(tag).toBeDefined();
      expect(tag.name).toBe('javascript');

      const foundTag = await tagRepository.findByName('javascript');
      expect(foundTag).toBeDefined();
      expect(foundTag?.id).toBe(tag.id);

      // Test findOrCreate with existing tag
      const existingTag = await tagRepository.findOrCreate('javascript');
      expect(existingTag.id).toBe(tag.id);

      // Test findOrCreate with new tag
      const newTag = await tagRepository.findOrCreate('typescript');
      expect(newTag).toBeDefined();
      expect(newTag.name).toBe('typescript');
      expect(newTag.id).not.toBe(tag.id);
    });
  });

  describe('Article Repository', () => {
    it('should create article with author relationship', async () => {
      // Create a user first
      const user = await userRepository.create({
        email: 'author@example.com',
        username: 'author',
        password: 'password',
      });

      const articleData = {
        slug: 'test-article',
        title: 'Test Article',
        description: 'A test article',
        body: 'This is the body of the test article',
        authorId: user.id,
      };

      const article = await articleRepository.create(articleData);

      expect(article).toBeDefined();
      expect(article.slug).toBe(articleData.slug);
      expect(article.authorId).toBe(user.id);

      // Test finding with author
      const articleWithAuthor = await articleRepository.findWithAuthor(article.slug);
      expect(articleWithAuthor).toBeDefined();
      expect(articleWithAuthor?.author.username).toBe(user.username);
      expect(articleWithAuthor?.tagList).toEqual([]);
    });

    it('should handle article-tag relationships', async () => {
      // Create user and article
      const user = await userRepository.create({
        email: 'author2@example.com',
        username: 'author2',
        password: 'password',
      });

      const article = await articleRepository.create({
        slug: 'tagged-article',
        title: 'Tagged Article',
        description: 'An article with tags',
        body: 'Article body',
        authorId: user.id,
      });

      // Create tags
      const tag1 = await tagRepository.create({ name: 'react' });
      const tag2 = await tagRepository.create({ name: 'nodejs' });

      // Associate tags with article
      await tagRepository.addToArticle(tag1.id, article.id);
      await tagRepository.addToArticle(tag2.id, article.id);

      // Verify article has tags
      const articleWithTags = await articleRepository.findWithAuthor(article.slug);
      expect(articleWithTags?.tagList).toContain('react');
      expect(articleWithTags?.tagList).toContain('nodejs');
      expect(articleWithTags?.tagList).toHaveLength(2);
    });
  });

  describe('Comment Repository', () => {
    it('should create comments with author and article relationships', async () => {
      // Create user and article
      const user = await userRepository.create({
        email: 'commenter@example.com',
        username: 'commenter',
        password: 'password',
      });

      const article = await articleRepository.create({
        slug: 'commented-article',
        title: 'Commented Article',
        description: 'An article with comments',
        body: 'Article body',
        authorId: user.id,
      });

      // Create comment
      const commentData = {
        body: 'This is a great article!',
        authorId: user.id,
        articleId: article.id,
      };

      const comment = await commentRepository.create(commentData);

      expect(comment).toBeDefined();
      expect(comment.body).toBe(commentData.body);
      expect(comment.authorId).toBe(user.id);
      expect(comment.articleId).toBe(article.id);

      // Test finding with author
      const commentWithAuthor = await commentRepository.findWithAuthor(comment.id);
      expect(commentWithAuthor).toBeDefined();
      expect(commentWithAuthor?.author.username).toBe(user.username);

      // Test finding by article
      const articleComments = await commentRepository.findByArticleId(article.id);
      expect(articleComments).toHaveLength(1);
      expect(articleComments[0]!.body).toBe(commentData.body);
      expect(articleComments[0]!.author.username).toBe(user.username);
    });
  });

  describe('Favorite Repository', () => {
    it('should handle article favoriting', async () => {
      // Create user and article
      const user = await userRepository.create({
        email: 'favoriter@example.com',
        username: 'favoriter',
        password: 'password',
      });

      const article = await articleRepository.create({
        slug: 'favorite-article',
        title: 'Favorite Article',
        description: 'An article to favorite',
        body: 'Article body',
        authorId: user.id,
      });

      // Create favorite
      const favorite = await favoriteRepository.create({
        userId: user.id,
        articleId: article.id,
      });

      expect(favorite).toBeDefined();
      expect(favorite.userId).toBe(user.id);
      expect(favorite.articleId).toBe(article.id);

      // Test favorited status
      const isFavorited = await favoriteRepository.isFavorited(user.id, article.id);
      expect(isFavorited).toBe(true);

      // Test favorite count
      const favoriteCount = await favoriteRepository.getFavoriteCount(article.id);
      expect(favoriteCount).toBe(1);

      // Test unfavoriting
      const removed = await favoriteRepository.deleteByUserAndArticle(user.id, article.id);
      expect(removed).toBe(true);

      const stillFavorited = await favoriteRepository.isFavorited(user.id, article.id);
      expect(stillFavorited).toBe(false);
    });
  });

  describe('Follow Repository', () => {
    it('should handle user following relationships', async () => {
      // Create two users
      const follower = await userRepository.create({
        email: 'follower@example.com',
        username: 'follower',
        password: 'password',
      });

      const following = await userRepository.create({
        email: 'following@example.com',
        username: 'following',
        password: 'password',
      });

      // Create follow relationship
      const follow = await followRepository.create({
        followerId: follower.id,
        followingId: following.id,
      });

      expect(follow).toBeDefined();
      expect(follow.followerId).toBe(follower.id);
      expect(follow.followingId).toBe(following.id);

      // Test following status
      const isFollowing = await followRepository.isFollowing(follower.id, following.id);
      expect(isFollowing).toBe(true);

      // Test follower/following counts
      const followersCount = await followRepository.getFollowersCount(following.id);
      const followingCount = await followRepository.getFollowingCount(follower.id);

      expect(followersCount).toBe(1);
      expect(followingCount).toBe(1);

      // Test unfollowing
      const removed = await followRepository.deleteByFollowerAndFollowing(follower.id, following.id);
      expect(removed).toBe(true);

      const stillFollowing = await followRepository.isFollowing(follower.id, following.id);
      expect(stillFollowing).toBe(false);
    });
  });

  describe('Database Integration', () => {
    it('should handle complex cross-table operations', async () => {
      // Create multiple users
      const author = await userRepository.create({
        email: 'author@example.com',
        username: 'author',
        password: 'password',
      });

      const reader = await userRepository.create({
        email: 'reader@example.com',
        username: 'reader',
        password: 'password',
      });

      // Reader follows author
      await followRepository.create({
        followerId: reader.id,
        followingId: author.id,
      });

      // Author creates article with tags
      const article = await articleRepository.create({
        slug: 'complex-article',
        title: 'Complex Article',
        description: 'A complex test article',
        body: 'Complex article body',
        authorId: author.id,
      });

      const tag1 = await tagRepository.findOrCreate('testing');
      const tag2 = await tagRepository.findOrCreate('integration');

      await tagRepository.addToArticle(tag1.id, article.id);
      await tagRepository.addToArticle(tag2.id, article.id);

      // Reader favorites the article
      await favoriteRepository.create({
        userId: reader.id,
        articleId: article.id,
      });

      // Reader comments on the article
      await commentRepository.create({
        body: 'Great article!',
        authorId: reader.id,
        articleId: article.id,
      });

      // Verify all relationships exist
      const articleWithAuthor = await articleRepository.findWithAuthor(article.slug);
      expect(articleWithAuthor?.author.username).toBe('author');
      expect(articleWithAuthor?.tagList).toContain('testing');
      expect(articleWithAuthor?.tagList).toContain('integration');

      const isFavorited = await favoriteRepository.isFavorited(reader.id, article.id);
      expect(isFavorited).toBe(true);

      const isFollowing = await followRepository.isFollowing(reader.id, author.id);
      expect(isFollowing).toBe(true);

      const comments = await commentRepository.findByArticleId(article.id);
      expect(comments).toHaveLength(1);
      expect(comments[0]!.author.username).toBe('reader');
    });
  });
});