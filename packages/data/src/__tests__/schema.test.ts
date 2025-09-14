import { describe, it, expect } from 'vitest';
import { createDatabase } from '../db';
import { users, articles, comments, tags } from '../schema';

describe('Database Schema', () => {
  it('should create database instance', () => {
    const db = createDatabase({ filename: ':memory:' });
    expect(db).toBeDefined();
  });

  it('should have all required tables defined', () => {
    expect(users).toBeDefined();
    expect(articles).toBeDefined();
    expect(comments).toBeDefined();
    expect(tags).toBeDefined();
  });

  it('should export types from index', async () => {
    const module = await import('../index.js');
    expect(module.users).toBeDefined();
    expect(module.createDatabase).toBeDefined();
    expect(module.sql).toBeDefined();
  });
});