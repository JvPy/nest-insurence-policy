import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { IUser } from 'src/interface/user.interface';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Login } from 'src/interface/login.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private userModel: Model<IUser>,
    private jwtService: JwtService,
  ) {}

  saltRounds = 10;

  async createUser(createUserDto: CreateUserDto): Promise<Partial<IUser>> {
    const userExists = await this.getUserByEmail(createUserDto.email);

    if (userExists) {
      throw new Error('This email is already registred');
    }

    const hashedPassword = bcrypt.hashSync(
      createUserDto.password,
      this.saltRounds,
    );

    const newUser = {
      email: createUserDto.email,
      password: hashedPassword,
    };

    await this.userModel.create(newUser);

    return newUser.email;
  }

  async login(createUserDto: CreateUserDto): Promise<Login> {
    const user = await this.getUserByEmail(createUserDto.email);

    if (!user) {
      return {
        status: HttpStatus.BAD_REQUEST,
        access_token: '',
      };
    }

    const match = await bcrypt.compare(createUserDto.password, user.password);

    if (!match) {
      return {
        status: HttpStatus.BAD_REQUEST,
        access_token: '',
      };
    }

    const payload = { email: user.email };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '1h',
      secret: 'secret',
    });

    return {
      status: HttpStatus.OK,
      access_token: accessToken,
    };
  }

  async validateToken(token: string) {
    return this.jwtService.verify(token, {
      secret: 'secret',
    });
  }

  protected async getUserByEmail(email: string): Promise<IUser> {
    const user = this.userModel.findOne({ email: email });

    return user;
  }
}
