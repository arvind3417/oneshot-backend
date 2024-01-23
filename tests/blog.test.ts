// @ts-nocheck

import request from 'supertest';
import app from '../src/app';
import { StatusCodes } from 'http-status-codes';
import { Blogs } from '../src/models/blog';
import { User } from '../src/models/user';
import * as hashUtils from '../src/helpers/hashPassword';
import * as CustomErrors from '../src/errors';

jest.mock('../src/models/blog');
jest.mock('../src/models/user');
jest.mock('../src/helpers/hashPassword');

const mockUserId = 'mockUserId';
const mockUser = {
  _id: mockUserId,
  username: 'mockUser',
  likedBlogs: [],
};

const mockBlogId = 'mockBlogId';
const mockBlog = {
  _id: mockBlogId,
  title: 'Mock Blog',
  aboutBlog: 'This is a mock blog.',
  imageurl: 'https://mockblog.com/image.jpg',
  likes: 0,
  comments: 0,
  allComments: [],
  ownerId: mockUserId,
};

const mockAccessToken = 'mockAccessToken';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('CRUD operations', () => {
  describe('getBlogs', () => {
    it('should get all blogs for the authenticated user', async () => {
        //@ts-ignore
      User.findOne.mockResolvedValueOnce(mockUser);
      Blogs.find.mockResolvedValueOnce([mockBlog]);

      const response = await request(app)
        .get('/api/blogs')
        .set('Authorization', `Bearer ${mockAccessToken}`);

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toEqual({
        success: true,
        message: 'Blogs retrieved successfully',
        data: [mockBlog],
      });
    });

    it('should handle error during getBlogs', async () => {
      User.findOne.mockRejectedValueOnce(new Error('Database error'));

      const response = await request(app)
        .get('/api/blogs')
        .set('Authorization', `Bearer ${mockAccessToken}`);

      expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(response.body).toEqual({
        success: false,
        message: 'Internal server error',
        error: 'InternalServerError',
      });
    });
  });

  describe('getBlog', () => {
    // Add tests for getBlog...
  });

  describe('postBlog', () => {
    // Add tests for postBlog...
  });

  describe('patchBlog', () => {
    // Add tests for patchBlog...
  });

  describe('deleteBlog', () => {
    // Add tests for deleteBlog...
  });
});

describe('ghostBlogs', () => {
  it('should get all blogs not owned by the authenticated user', async () => {
    User.findOne.mockResolvedValueOnce(mockUser);
    Blogs.find.mockResolvedValueOnce([mockBlog]);

    const response = await request(app)
      .get('/api/blogs/ghost')
      .set('Authorization', `Bearer ${mockAccessToken}`);

    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body).toEqual([mockBlog]);
  });

  it('should handle error during ghostBlogs', async () => {
    User.findOne.mockRejectedValueOnce(new Error('Database error'));

    const response = await request(app)
      .get('/api/blogs/ghost')
      .set('Authorization', `Bearer ${mockAccessToken}`);

    expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.body).toEqual({
      success: false,
      message: 'Internal server error',
      error: 'InternalServerError',
    });
  });
});

describe('likeBlog', () => {
  it('should like a blog for the authenticated user', async () => {
    User.findOne.mockResolvedValueOnce(mockUser);
    Blogs.findOne.mockResolvedValueOnce(mockBlog);
    Blogs.updateOne.mockResolvedValueOnce({ nModified: 1 });
    User.updateOne.mockResolvedValueOnce({ nModified: 1 });

    const response = await request(app)
      .post(`/api/blogs/like/${mockBlogId}`)
      .set('Authorization', `Bearer ${mockAccessToken}`);

    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body).toEqual({
      success: true,
      message: 'Liked successfully',
      data: {},
    });
  });

  it('should handle error during likeBlog', async () => {
    User.findOne.mockRejectedValueOnce(new Error('Database error'));

    const response = await request(app)
      .post(`/api/blogs/like/${mockBlogId}`)
      .set('Authorization', `Bearer ${mockAccessToken}`);

    expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.body).toEqual({
      success: false,
      message: 'Internal server error',
      error: 'InternalServerError',
    });
  });
});

describe('comment', () => {
  it('should add a comment to a blog for the authenticated user', async () => {
    User.findOne.mockResolvedValueOnce(mockUser);
    Blogs.findOne.mockResolvedValueOnce(mockBlog);
    Blogs.updateOne.mockResolvedValueOnce({ nModified: 1 });

    const response = await request(app)
      .post(`/api/blogs/comment/${mockBlogId}`)
      .set('Authorization', `Bearer ${mockAccessToken}`)
      .send({ comment: 'Great blog!' });

    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body).toEqual({
      success: true,
      message: 'Commented successfully on the blog.',
      data: {},
    });
  });

  it('should handle error during comment', async () => {
    User.findOne.mockRejectedValueOnce(new Error('Database error'));

    const response = await request(app)
      .post(`/api/blogs/comment/${mockBlogId}`)
      .set('Authorization', `Bearer ${mockAccessToken}`)
      .send({ comment: 'Great blog!' });

    expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.body).toEqual({
      success: false,
      message: 'Internal server error',
      error: 'InternalServerError',
    });
  });
});
