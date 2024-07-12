import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { HttpStatus } from '@nestjs/common';
import { AuthService } from '../../service/auth/auth.service';
import { User } from 'src/schema/user.schema';
import { CreateUserDto } from '../../dto/create-user.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const invalidCreateUserDto: CreateUserDto = {
    email: '',
    password: 'test',
  };

  const validCreateUserDto: CreateUserDto = {
    email: 'test@test.com',
    password: 'test',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            createUser: jest.fn(),
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a new user and return 201 Created', async () => {
      const createdUser: User = {
        email: validCreateUserDto.email,
        password: 'as',
      };

      jest.spyOn(authService, 'createUser').mockResolvedValue(createdUser);

      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.createUser(response, validCreateUserDto);

      expect(response.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(response.json).toHaveBeenCalledWith({
        message: 'User has been created successfully',
        newUser: createdUser,
      });
    });

    it('should handle errors and return 400 Bad Request', async () => {
      const errorMessage = 'Error: User not created!';
      const error = new Error(errorMessage);

      jest.spyOn(authService, 'createUser').mockRejectedValue(error);

      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.createUser(response, invalidCreateUserDto);

      expect(response.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(response.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.BAD_REQUEST,
        message: errorMessage,
        error: 'Bad Request',
      });
    });
  });

  describe('login', () => {
    it('should successfully log in and return access token', async () => {
      const loginResult = {
        status: HttpStatus.OK,
        access_token: 'test-access-token',
      };

      jest.spyOn(authService, 'login').mockResolvedValue(loginResult);

      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.login(response, validCreateUserDto);

      expect(response.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(response.json).toHaveBeenCalledWith({
        message: 'Login sucessful',
        access_token: loginResult.access_token,
      });
    });

    it('should handle login errors and return the correct status and response', async () => {
      const errorMessage = 'Invalid credentials';
      const errorResponse = {
        status: HttpStatus.UNAUTHORIZED,
        response: {
          message: errorMessage,
        },
      };

      jest.spyOn(authService, 'login').mockRejectedValue(errorResponse);

      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.login(response, validCreateUserDto);

      expect(response.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
      expect(response.json).toHaveBeenCalledWith(errorResponse.response);
    });
  });
});
