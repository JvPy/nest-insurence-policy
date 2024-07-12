import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { CreateUserDto } from '../../dto/create-user.dto';
import { AuthService } from '../../service/auth/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/user')
  async createUser(@Res() response, @Body() createUserDto: CreateUserDto) {
    try {
      const newUser = await this.authService.createUser(createUserDto);

      return response.status(HttpStatus.CREATED).json({
        message: 'User has been created successfully',
        newUser,
      });
    } catch (err) {
      const badRequest = HttpStatus.BAD_REQUEST;

      return response.status(badRequest).json({
        statusCode: badRequest,
        message: err.message || 'Error: User not created!',
        error: 'Bad Request',
      });
    }
  }

  @Post('/login')
  async login(@Res() response, @Body() createUserDto: CreateUserDto) {
    try {
      const result = await this.authService.login(createUserDto);

      return response.status(result.status).json({
        message: 'Login sucessful',
        access_token: result.access_token,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }
}
