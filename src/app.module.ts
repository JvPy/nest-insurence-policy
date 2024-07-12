import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PolicySchema } from './schema/policy.schema';
import { PolicyService } from './service/policy/policy.service';
import { PolicyController } from './controller/policy/policy.controller';
import { AuthController } from './controller/auth/auth.controller';
import { AuthService } from './service/auth/auth.service';
import { UserSchema } from './schema/user.schema';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017', {
      dbName: 'insurancePoliciesDB',
    }),
    MongooseModule.forFeature([{ name: 'Policy', schema: PolicySchema }]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    JwtModule,
  ],
  controllers: [AppController, PolicyController, AuthController],
  providers: [AppService, PolicyService, AuthService],
})
export class AppModule {}
