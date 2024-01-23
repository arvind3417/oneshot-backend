import request from 'supertest';
import app from "../src/app";
import { StatusCodes } from 'http-status-codes';
import { jest } from '@jest/globals';
import { User } from '../src/models/user';
import * as hashUtils from "../src/helpers/hashPassword";

import dotenv from "dotenv";
dotenv.config();

jest.mock('../src/models/user')
jest.mock("../../helpers/jwt", () => ({ 
  genAccessToken: jest.fn(() => 'access_token'),
  genRefreshToken: jest.fn(() => 'refresh_token')
}));
dotenv.config();
jest.mock("../src/models/user")
jest.mock("../src/helpers/hashPassword", () => ({
  hashPassword: jest.fn(() => 'hashdpasswordd')
}));
jest.mock("../src/helpers/jwt", () => ({
  genAccessToken: jest.fn(() => 'access_token'),
  genRefreshToken: jest.fn(() => 'refresh_token')
}));


describe('POST /register', () => {
    it('should register a new user with valid data', async () => {
        // Mock the User.create method and provide a mock implementation
        // jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce({})
        //@ts-ignore
        const createMock = jest.spyOn(User, 'create').mockImplementation(async () => {
          return {
            _id: '650eb609d7b42e5e44a50d64',
            name: 'New User1',
            email: 'newuser@example1.com',
            password: 'hashdpasswordd',
          };
        });
       
    
    
        // Send a POST request to your registration endpoint 
        const response = await request(app)
          .post('/api/v1/auth/register')
          .send({
            name: 'test user',
            email: 'testuser@example1.com',
            password: 'password123',
          }); 
          
        
        // Assertions for the HTTP response 
        expect(response.status).toBe(StatusCodes.CREATED);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('User created successfully'); 
        expect(response.body.data.accessToken).toBeDefined();
    
      
    
        // // Restore the original method after the test
        createMock.mockRestore();
      });
    it('shouldnt register a new user without role', async () => {
        const response = await request(app)
          .post('/api/v1/auth/register')
          .send({
            // name: 'Test User',
            email: 'test@example.com',
            password: 'testpassword', 
          });
    
    
        expect(response.status).toBe(StatusCodes.BAD_REQUEST);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Please provide all required fields") 
        // expect(response.body.data).toBe() 
    
    
        // expect(response.body.data).toHaveProperty('accessToken');
        // expect(response.body.data).toHaveProperty('refreshToken');
      });

      it('should return an error for duplicate email', async () => {
        // User.findOne = jest.fn().mockResolvedValueOnce('test@example.com');
        // User.findOne.mockResolvedValue({ email: 'test@example.com' });
        jest.spyOn(User, 'findOne').mockResolvedValue({ email: 'test@example.com' });
    
       const response= await request(app)
          .post('/api/v1/auth/register')
          .send({
            name: 'Test User',
            email: 'test@example.com',
            password: 'testpassword',
          });
    // await User.findOne({email:'test@example.com'}) 
        //  jest.spyOn(User,'findOne').mockResolvedValueOnce('test@example.com')
          expect(response.status).toBe(StatusCodes.BAD_REQUEST);
          expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("User already exists")  
    
    
    
    
        });
 
  });