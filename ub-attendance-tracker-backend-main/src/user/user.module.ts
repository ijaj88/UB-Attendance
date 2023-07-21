import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AffiliationModule } from 'src/affiliation/affiliation.module';

import { JwtAuthStrategy } from '../auth/strategies/jwt-auth.strategy';
import { SharedModule } from '../shared/shared.module';
import { UserController } from './controllers/user.controller';
import { User } from './entities/users.entity';
import { UserRepository } from './repositories/user.repository';
import { UserVerifyRepository } from './repositories/user-verify.respository';
import { UserService } from './services/user.service';
import { UserAclService } from './services/user-acl.service';


@Module({
  imports: [SharedModule, TypeOrmModule.forFeature([User]), AffiliationModule,JwtModule],
  providers: [UserService, JwtAuthStrategy, UserAclService, UserVerifyRepository,UserRepository],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
