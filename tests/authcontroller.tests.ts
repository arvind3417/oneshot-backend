import request from 'supertest';
import app from "../src/app";
import { StatusCodes } from 'http-status-codes';
import { jest } from '@jest/globals';
import { User } from '../src/models/user';
import * as hashUtils from "../src/helpers/hashPassword";

import dotenv from "dotenv";
import { Blogs} from '../src/models/blog';
dotenv.config();

jest.mock('../src/models/user')
jest.mock("../../helpers/jwt", () => ({ 
  genAccessToken: jest.fn(() => 'access_token'),
  genRefreshToken: jest.fn(() => 'refresh_token')
}));

const hashCompareMock = jest.spyOn(hashUtils, 'hashCompare');
describe('POST /login', () => {
  it('should log in a user with valid credentials', async () => {
    // Test login with valid credentials
    jest.spyOn(User, 'findOne').mockResolvedValue({ email: 'testuser@example1.com' });
    hashCompareMock.mockReturnValue(true);


    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'testuser@example1.com', 
        password: 'password123', 
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('User logged in successfully');
    expect(response.body.data.accessToken).toBeDefined();
  });

  it('should return an error with invalid credentials', async () => {
    // Test login with an invalid email
  //   User.findOne = jest.fn().mockResolvedValue(null);
    jest.spyOn(User, 'findOne').mockResolvedValue(null);


    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'invalid@example.com',
        password: 'password123',
      });

    expect(response.status).toBe(StatusCodes.NOT_FOUND);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Invalid email or user does not exist');
  });

  it('should return an error with incorrect password', async () => {
    // Test login with a valid email but incorrect password
    const mockUser = {
      email: 'testuser@example1.com',
      password: 'correctpassword',
    };
          jest.spyOn(User, 'findOne').mockResolvedValue(mockUser);
          hashCompareMock.mockReturnValue(false);

    const response = await request(app)
      .post('/api/auth/login')
      .send({ 
        email: 'testuser@example1.com',  
        password: 'wrongpassword',
      });

    expect(response.status).toBe(StatusCodes.UNAUTHORIZED); 
    expect(response.body.success).toBe(false); 
    expect(response.body.message).toBe('Invalid password');
  });

});
