import {
  BadRequestException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { plainToClass } from 'class-transformer';
import * as nodemailer from 'nodemailer';
import { transporter } from 'src/shared/constants/email-constants';
import { User } from 'src/user/entities/users.entity';

import { AppLogger } from '../../shared/logger/logger.service';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import { UserOutput } from '../../user/dtos/user-output.dto';
import { UserService } from '../../user/services/user.service';
import { ROLE } from '../constants/role.constant';
import { ForgotPassword } from '../dtos/auth-forget-password.dto';
import { RefreshTokenInput } from '../dtos/auth-refresh-token-input.dto';
import { RegisterInput } from '../dtos/auth-register-input.dto';
import { RegisterOutput } from '../dtos/auth-register-output.dto';
import { ResetPassword } from '../dtos/auth-reset-password.dto';
import {
  AuthTokenOutput,
  UserAccessTokenClaims,
} from '../dtos/auth-token-output.dto';
import { TokenVerify } from '../dtos/auth-verify-mail.dto';
import { ResendToken } from '../dtos/resend-email-token.dto';


@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(AuthService.name);
  }

  async validateUser(
    ctx: RequestContext,
    email: string,
    pass: string,
  ): Promise<UserAccessTokenClaims> {
    this.logger.log(ctx, `${this.validateUser.name} was called`);

    // The userService will throw Unauthorized in case of invalid username/password.
    const user = await this.userService.validateUsernamePassword(
      ctx,
      email,
      pass,
    );

    // Prevent disabled users from logging in.
    if (user.isAccountDisabled) {
      throw new UnauthorizedException('This user account has been disabled');
    }

    return user;
  }

  login(ctx: RequestContext): AuthTokenOutput {
    this.logger.log(ctx, `${this.login.name} was called`);

    return this.getAuthToken(ctx, ctx.user);
  }

  async register(
    ctx: RequestContext,
    input: RegisterInput,
  ): Promise<any> {
    this.logger.log(ctx, `${this.register.name} was called`);

    // TODO : Setting default role as USER here. Will add option to change this later via ADMIN users.
    input.roles = [ROLE.USER];
    input.isAccountDisabled = false;

    const user = await this.userService.findByEmail(
      ctx,
      input.username + '@buffalo.edu',
    );

    if (user) {
      throw new BadRequestException('User with the email already exists');
    }
  /*  if(input.old_registration){

      const registeredUser = await this.userService.createUser(ctx, {
        ...input,
        email: input.username + '@buffalo.edu',
      });
  return registeredUser;
    }
    else*/
    {
      const registeredUser = await this.userService.createUserToken(ctx, {
        ...input,
        email: input.username + '@buffalo.edu',
      });
  
  
      return registeredUser;

    }
//old way
//    const registeredUser = await this.userService.createUser(ctx, { 
 // new way
    const registeredUser = await this.userService.createUserToken(ctx, {
      ...input,
      email: input.username + '@buffalo.edu',
    });


  //  return registeredUser;

  }

  async refreshToken(ctx: RequestContext): Promise<AuthTokenOutput> {
    this.logger.log(ctx, `${this.refreshToken.name} was called`);

    const user = await this.userService.findById(ctx, ctx.user.id);
    if (!user) {
      throw new UnauthorizedException('Invalid user id');
    }

    return this.getAuthToken(ctx, user);
  }

  getAuthToken(
    ctx: RequestContext,
    user: UserAccessTokenClaims | User,
  ): AuthTokenOutput {
    this.logger.log(ctx, `${this.getAuthToken.name} was called`);

    const subject = { sub: user.id };
    const payload = {
      username: user.username,
      sub: user.id,
      roles: user.roles,
    };

    const authToken = {
      refreshToken: this.jwtService.sign(subject, {
        expiresIn: this.configService.get('jwt.refreshTokenExpiresInSec'),
      }),
      accessToken: this.jwtService.sign(
        { ...payload, ...subject },
        { expiresIn: this.configService.get('jwt.accessTokenExpiresInSec') },
      ),
    };
    return plainToClass(AuthTokenOutput, authToken, {
      excludeExtraneousValues: true,
    });
  }

  async sendPasswordVerification(
  input: ForgotPassword,
  ): Promise<any> {

    const user = await this.userService.VerifyPassword( input
    );
    return user;
    }

  async sendEmailVerification(
    input: TokenVerify,
    ): Promise<any> {
  
      const user = await this.userService.VerifyUserMail( input
      );
      return user;
      }

    async resendingToken(
      input: ResendToken
      ):Promise<any> {
      {

        return await this.userService.resendtoken(input);

      }
    }

   async forgotpass( 
   input: ResetPassword,
  ): Promise<any> {
    {

    const authToken = await this.userService.forgotpass(input);
    return authToken
    }
  }


}
