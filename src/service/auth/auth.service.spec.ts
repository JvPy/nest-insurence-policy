import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { CreateUserDto } from '../../dto/create-user.dto';
import { IUser } from '../../interface/user.interface';
import * as bcrypt from 'bcrypt';
import { HttpStatus } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let userModel: Model<IUser>;
  let jwtService: JwtService;

  beforeEach(() => {
    userModel = {
      findOne: jest.fn(),
      create: jest.fn(),
    } as any;

    jwtService = {
      signAsync: jest.fn(),
      verify: jest.fn(),
    } as any;

    authService = new AuthService(userModel, jwtService);
  });

  describe('createUser', () => {
    it('should create a new user successfully', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      (authService as any).getUserByEmail = jest.fn().mockResolvedValue(null);
      jest.spyOn(bcrypt, 'hashSync').mockReturnValue('hashedPassword');

      userModel.create = jest
        .fn()
        .mockResolvedValue({ email: createUserDto.email });

      const result = await authService.createUser(createUserDto);

      expect(result).toEqual('test@example.com');
      expect(userModel.create).toHaveBeenCalled();
    });

    it('should throw an error if user already exists', async () => {
      const createUserDto: CreateUserDto = {
        email: 'existing@example.com',
        password: 'password123',
      };

      (authService as any).getUserByEmail = jest
        .fn()
        .mockResolvedValue({ email: 'existing@example.com' });

      await expect(authService.createUser(createUserDto)).rejects.toThrow(
        'This email is already registred',
      );
    });
  });

  describe('login', () => {
    it('should return access token on successful login', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const user = {
        email: 'test@example.com',
        password: 'hashedPassword',
      };

      (authService as any).getUserByEmail = jest.fn().mockResolvedValue(user);

      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
      jwtService.signAsync = jest.fn().mockResolvedValue('mocked-access-token');

      const result = await authService.login(createUserDto);

      expect(result).toEqual({
        status: HttpStatus.OK,
        access_token: 'mocked-access-token',
      });
    });

    it('should return BAD_REQUEST if user does not exist', async () => {
      const createUserDto: CreateUserDto = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      (authService as any).getUserByEmail = jest.fn().mockResolvedValue(null);

      const result = await authService.login(createUserDto);

      expect(result).toEqual({
        status: HttpStatus.BAD_REQUEST,
        access_token: '',
      });
    });

    it('should return BAD_REQUEST if password is incorrect', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      const user = {
        email: 'test@example.com',
        password: 'hashedPassword',
      };

      (authService as any).getUserByEmail = jest.fn().mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      const result = await authService.login(createUserDto);

      expect(result).toEqual({
        status: HttpStatus.BAD_REQUEST,
        access_token: '',
      });
    });
  });

  describe('validateToken', () => {
    it('should validate token successfully', async () => {
      const token = 'mocked-token';
      const payload = { email: 'test@example.com' };

      jwtService.verify = jest.fn().mockReturnValue(payload);

      const result = await authService.validateToken(token);

      expect(result).toEqual(payload);
    });

    it('should throw an error if token is invalid', async () => {
      const token = 'invalid-token';

      jwtService.verify = jest.fn().mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(authService.validateToken(token)).rejects.toThrow(
        'Invalid token',
      );
    });
  });
});
