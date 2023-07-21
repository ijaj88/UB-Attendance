import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { plainToClass } from 'class-transformer';
import * as nodemailer from 'nodemailer';
import * as Papa from 'papaparse';
import { AffiliationService } from 'src/affiliation/affiliation.service';
import { CreateAffiliationDto } from 'src/affiliation/dto/create-affiliation.dto';
import { Affiliation } from 'src/affiliation/entities/affiliation.entity';
import { AffiliationToUser } from 'src/affiliation/entities/affiliation_to_user.entity';
import { AffiliationRepository } from 'src/affiliation/repositories/affiliation.repository';
import { AffiliationToUserRepository } from 'src/affiliation/repositories/affiliation-user.repository';
import { ForgotPassword } from 'src/auth/dtos/auth-forget-password.dto';
import { ResetPassword } from 'src/auth/dtos/auth-reset-password.dto';
import { TokenVerify } from 'src/auth/dtos/auth-verify-mail.dto';
import { ResendToken } from 'src/auth/dtos/resend-email-token.dto';
import { transporter } from 'src/shared/constants/email-constants';

import { AppLogger } from '../../shared/logger/logger.service';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import { UserAffiliation } from '../dtos/user-affilation.dto';
import { CreateUserInput } from '../dtos/user-create-input.dto';
import { UserOutput } from '../dtos/user-output.dto';
import { UpdateRoleDto, UpdateUserInput } from '../dtos/user-update-input.dto';
import { VerifyUser } from '../entities/user-verification.entity';
import { User } from '../entities/users.entity';
import { UserRepository } from '../repositories/user.repository';
import { UserVerifyRepository } from '../repositories/user-verify.respository';

@Injectable()
export class UserService {
  constructor(
    private repository: UserRepository,
    private readonly logger: AppLogger,
    private readonly affilationService: AffiliationService,
    private readonly AffiliationToUserRepository: AffiliationToUserRepository,
    private readonly AffiliationRepository: AffiliationRepository,
    private readonly UserVerifyRepository: UserVerifyRepository,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    this.logger.setContext(UserService.name);
  }

  async createUser(
    ctx: RequestContext,
    input: CreateUserInput,
  ): Promise<UserOutput> {
    this.logger.log(ctx, `${this.createUser.name} was called`);
    const user = plainToClass(User, input);

    user.password = await hash(input.password, 10);

    this.logger.log(ctx, `calling ${UserRepository.name}.saveUser`);
    if (input.affilations && input.affilations.length > 0) {
      const affilations: Affiliation[] = [];
      const Affnew: Affiliation[] = [];
      for (const affilation of input.affilations) {
        const affilationObj =
          await this.affilationService.getAffilationByIdInternal(affilation);
        // Affnew.push(affilationObj);
        if (!affilationObj) {
          throw new Error(
            `${affilation} affiliation does not exist, cannot create user`,
          );
        }

        if (affilationObj) {
          affilations.push(affilationObj);
        }
      }

      // user.affilation = affilations;
      //const affilationObj =
      //await this.affilationService.getAffilationByIdInternal(uder.id);
      //user.affilation = affilations;
    }

    const uder = await this.repository.save(user);
    for (const affilation of input.affilations) {
      const aff = plainToClass(AffiliationToUser, input);
      aff.user = uder;
      const affilationObj =
        await this.affilationService.getAffilationByIdInternal(affilation);
      aff.affiliation = affilationObj;

      if (affilationObj) {
        await this.AffiliationToUserRepository.save(aff);
      }
    }

    return plainToClass(UserOutput, user, {
      excludeExtraneousValues: true,
    });
  }

  async createUserToken(
    ctx: RequestContext,
    input: CreateUserInput,
  ): Promise<{ data: UserOutput; message: any }> {
    this.logger.log(ctx, `${this.createUser.name} was called`);
    const user = plainToClass(VerifyUser, input);

    user.password = await hash(input.password, 10);

    this.logger.log(ctx, `calling ${UserRepository.name}.saveUser`);

    if (input.affilations && input.affilations.length > 0) {
      const affilations: Affiliation[] = [];
      const Affnew: Affiliation[] = [];
      for (const affilation of input.affilations) {
        const affilationObj =
          await this.affilationService.getAffilationByIdInternal(affilation);
        // Affnew.push(affilationObj);
        if (!affilationObj) {
          throw new Error(
            `${affilation} affiliation does not exist, cannot create user`,
          );
        }

        if (affilationObj) {
          affilations.push(affilationObj);
        }
      }
    }
    user.affindex = input.affilations;
    console.log(user);

    const forgotpass = new ForgotPassword();
    const body = {
      mail: input.username,
      token: 1,
    };

    //  const {accessToken,token}= await this.createEmailToken(user.username,forgotpass);
    const { accessToken, token } = await this.createEmailToken(body);

    user.emailToken = token;
    user.isVerified = false;
    const userexist = await this.UserVerifyRepository.findOne({
      where: { username: user.username },
    });
    if (!userexist) {
      const uder = await this.UserVerifyRepository.save(user);
    } else {
      //userexist.affindex=null;
      //userexist.affindex=user.affindex;
      const updatedUser: VerifyUser = {
        ...userexist,
        ...user,
      };

      updatedUser.emailToken = token;

      await this.UserVerifyRepository.save(updatedUser);
    }
    const preview = await this.sendEmailVerificationToken(
      user.username,
      accessToken,
    );

    const message = `token is ${accessToken} user registered and verfication mail sent to ${user.email},${preview}`;
    console.log(message);
    const out: UserOutput = plainToClass(UserOutput, user, {
      excludeExtraneousValues: true,
    });

    return {
      data: out,
      message: {
        //sendPromise: preview,
        //accessToken: accessToken,
      },
    };
  }

  async findByIdInternal(ctx: RequestContext, id: number) {
    this.logger.log(ctx, `${this.findById.name} was called`);

    this.logger.log(ctx, `calling ${UserRepository.name}.findOne`);
    const user = await this.repository.findOne({ where: { id } });

    return user;
  }

  //async createEmailToken(input: string,paypass:ForgotPassword){
  async createEmailToken(input: any) {
    const token = Math.floor(Math.random() * 9000000 + 1000000);
    /*
    let payload;
    if(input){
    payload = { 
      mail: input,
      token: token
    };
  }
  else{    
    payload = { 
      mail: paypass.username,
      token: token,
      password: paypass.Newpassword
    };
  }*/
    input.token = token;
    const secretKey = this.configService.get<string>('jwt.publicKey');
    const expiresIn = '1h';

    const algorithm = 'HS256'; // The algorithm used for signing the token
    const accessToken = this.jwtService.sign(input, {
      secret: secretKey,
      expiresIn: expiresIn,
      algorithm: algorithm, // Specify the algorithm to be used for signing the token
    });
    console.log(token, input, secretKey, expiresIn, accessToken);

    return {
      accessToken: accessToken,
      token: token,
    };
  }

  async validateUsernamePassword(
    ctx: RequestContext,
    username: string,
    pass: string,
  ): Promise<UserOutput> {
    this.logger.log(ctx, `${this.validateUsernamePassword.name} was called`);

    this.logger.log(ctx, `calling ${UserRepository.name}.findOne`);
    const user = await this.repository.findOne({ where: { username } });
    if (!user) throw new UnauthorizedException();

    const match = await compare(pass, user.password);
    if (!match) throw new UnauthorizedException();

    return plainToClass(UserOutput, user, {
      excludeExtraneousValues: true,
    });
  }

  async parseAndUpdateUserInformation(ctx: RequestContext, input: string) {
    const parsed = Papa.parse(input, { header: true });
    for (const data of parsed.data) {
      const updateInput = plainToClass(User, data);
      const user = await this.findByUsername(ctx, updateInput.username);
      if (user) {
        const updatedUser: User = {
          ...user,
          ...updateInput,
        };

        this.logger.log(ctx, `calling ${UserRepository.name}.save`);
        await this.repository.save(updatedUser);
      }
    }
  }

  async getUsers(
    ctx: RequestContext,
    limit: number,
    offset: number,
  ): Promise<{ users: User[]; count: number }> {
    this.logger.log(ctx, `${this.getUsers.name} was called`);

    this.logger.log(ctx, `calling ${UserRepository.name}.findAndCount`);
    const [users, count] = await this.repository.findAndCount({
      where: {},
      take: limit,
      skip: offset,
    });

    const usersWithAffiliations = [];

    for (const user of users) {
      const affiliations = await this.AffiliationRepository.createQueryBuilder(
        'affiliation',
      )
        .leftJoinAndSelect(
          'affiliation.affiliation_to_user',
          'affiliation_to_user',
        )
        .leftJoinAndSelect('affiliation_to_user.user', 'user')
        .where('user.id = :id', { id: user.id })
        .select(['affiliation.id', 'affiliation.name'])
        .getMany();

      user.affilation = affiliations;
      delete user.password;
      //     console.log(user);

      //        usersWithAffiliations.push(user);
    }

    //console.log(users);
    //  throw new Error('not implemented');

    return { users, count };
  }

  async findById(ctx: RequestContext, id: number): Promise<User> {
    this.logger.log(ctx, `${this.findById.name} was called`);

    this.logger.log(ctx, `calling ${UserRepository.name}.findOne`);

    const user = await this.repository.findOne({
      where: { id },
      // relations: { affiliation_to_user: true },
    });
    const affiliations = await this.AffiliationRepository.createQueryBuilder(
      'affiliation',
    )
      .leftJoinAndSelect(
        'affiliation.affiliation_to_user',
        'affiliation_to_user',
      )
      .leftJoinAndSelect('affiliation_to_user.user', 'user')
      .where('user.id = :id', { id: ctx.user.id })
      .select([
        'affiliation_to_user.affiliation_to_userId',
        'affiliation.id',
        'affiliation.name',
      ])
      .getMany();

    user.affilation = affiliations;

    // user.affilation = affilationObj

    delete user.password;

    return user;
  }

  async findByEmail(ctx: RequestContext, email: string): Promise<UserOutput> {
    this.logger.log(ctx, `${this.findById.name} was called`);

    this.logger.log(ctx, `calling ${UserRepository.name}.findOne`);
    const user = await this.repository.findOne({ where: { email } });

    return plainToClass(UserOutput, user);
  }

  async getUserById(ctx: RequestContext, id: number): Promise<User> {
    this.logger.log(ctx, `${this.getUserById.name} was called`);

    this.logger.log(ctx, `calling ${UserRepository.name}.getById`);
    const user = await this.repository.getById(id);

    const affiliations = await this.AffiliationRepository.createQueryBuilder(
      'affiliation',
    )
      .leftJoinAndSelect(
        'affiliation.affiliation_to_user',
        'affiliation_to_user',
      )
      .leftJoinAndSelect('affiliation_to_user.user', 'user')
      .where('user.id = :id', { id: id })
      .select(['affiliation.id', 'affiliation.name'])
      .getMany();

    user.affilation = affiliations;
    delete user.password;

    return user;
  }

  async findByUsername(
    ctx: RequestContext,
    username: string,
  ): Promise<UserOutput> {
    this.logger.log(ctx, `${this.findByUsername.name} was called`);

    this.logger.log(ctx, `calling ${UserRepository.name}.findOne`);
    const user = await this.repository.findOne({ where: { username } });

    return plainToClass(UserOutput, user, {
      excludeExtraneousValues: true,
    });
  }

  async updateUser(
    ctx: RequestContext,
    userId: number,
    input: UpdateUserInput,
  ): Promise<UserOutput> {
    this.logger.log(ctx, `${this.updateUser.name} was called`);

    this.logger.log(ctx, `calling ${UserRepository.name}.getById`);
    const user = await this.repository.getById(userId);

    // Hash the password if it exists in the input payload.
    if (input.password) {
      input.password = await hash(input.password, 10);
    }

    // merges the input (2nd line) to the found user (1st line)
    const updatedUser: User = {
      ...user,
      ...plainToClass(User, input),
    };

    this.logger.log(ctx, `calling ${UserRepository.name}.save`);
    await this.repository.save(updatedUser);

    return plainToClass(UserOutput, updatedUser, {
      excludeExtraneousValues: true,
    });
  }

  async updateRole(
    ctx: RequestContext,
    input: UpdateRoleDto,
  ): Promise<UserOutput> {
    this.logger.log(ctx, `${this.updateUser.name} was called`);

    this.logger.log(ctx, `calling ${UserRepository.name}.getById`);
    const user = await this.repository.findOne({
      where: { username: input.username },
    });

    delete input.username;
    const updatedUser: User = {
      ...user,
      ...plainToClass(User, input),
    };

    this.logger.log(ctx, `calling ${UserRepository.name}.save`);
    await this.repository.save(updatedUser);

    return plainToClass(UserOutput, updatedUser, {
      excludeExtraneousValues: true,
    });
  }

  async sendEmailVerificationToken(
    username: string,
    message: string,
  ): Promise<any> {
    //const repository = await this.emailVerificationRepository.findOne({
    // email,
    //});

    // if (repository && repository.emailToken)
    // create a transporter object with the SMTP configuration
    console.log(
      process.env.EMAIL_USER,
      process.env.EMAIL_PORT,
      process.env.EMAIL_HOST,
      process.env.EMAIL_PASSWORD,
      process.env.APP_PORT,
    );

    const mailOptions = {
      from: '"UB Attendance Tracker" <' + process.env.EMAIL_USER + '>',
      to: '"user" <' + username + '@buffalo.edu' + '>',
      subject: 'Verify Email',
      text: 'Verify Email',
      html: `Hi! <br><br> Thanks for your registration <br><br>
    <a href='https://webdev.cse.buffalo.edu/attendance/account/verify?username=${username}&verificationCode=${message}'> Click here to activate your account</a>`,
    };

    console.log(mailOptions);
    // create a message object with the email content

    // use the sendMail method to send the message
    const sendMailPromise = new Promise<string>((resolve, reject) => {
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.log('Error occurred. ' + err.message);
          reject(err);
        } else {
          console.log('Message sent: %s', info.messageId);
          // Preview only available when sending through an Ethereal account
          console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
          const urldata = nodemailer.getTestMessageUrl(info);
          console.log(urldata);
          resolve(urldata);
        }
      });
    });

    return sendMailPromise;
  }

  async VerifyUserMail(input: TokenVerify): Promise<any> {
    const secretKey = this.configService.get<string>('jwt.publicKey');
    const algorithm = 'HS256'; // The algorithm used for signing the token

    // This is how you can verify the accessToken and extract the mail and token
    const decoded = this.jwtService.verify(input.token, {
      secret: secretKey,
      algorithms: [algorithm], // Specify the algorithm to be used for verification
    });
    const mailread = decoded.mail;
    const tokenread = decoded.token;

    console.log(mailread, tokenread);

    const user = await this.UserVerifyRepository.findOne({
      where: { username: input.username },
    });
    if (!user) {
      throw new BadRequestException('username not found');
    }

    if (user.isVerified) {
      throw new BadRequestException('email already verified');
    }

    if (user.emailToken === tokenread) {
      user.isVerified = true;
      await this.UserVerifyRepository.save(user);

      const us = await this.UserVerifyRepository.findOne({
        where: { email: input.username },
        //relations: { affilation:true},
      });
      const updatedUser: User = {
        ...user,
        ...plainToClass(User, user),
      };

      const arrOfNumbers = user.affindex.map(Number);

      const usder = await this.repository.save(updatedUser);

      for (const affilation of arrOfNumbers) {
        const aff = plainToClass(AffiliationToUser, input);
        aff.user = usder;
        const affilationObj =
          await this.affilationService.getAffilationByIdInternal(affilation);
        aff.affiliation = affilationObj;

        if (affilationObj) {
          await this.AffiliationToUserRepository.save(aff);
        }
      }
      await this.repository.save(updatedUser);
      return 'user verified and created and can log in now';
    } else {
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Cannot Verify User',
      });
    }
  }

  async resendtoken(input: ResendToken): Promise<any> {
    const email = input.username + '@buffalo.edu';

    const user = await this.UserVerifyRepository.findOne({
      where: { email: email },
    });
    if (!user) {
      throw new BadRequestException(`username not found ${email}`);
    }
    /*
  const {accessToken,token}= await this.createEmailToken(user.username);

    user.emailToken = token;
    user.isVerified = false;
    const uder=await this.UserVerifyRepository.save(user);
    const preview= await this.sendEmailVerificationToken(user.username, accessToken);

    return preview +' send to your email';
  */
  }

  async forgotpass(input: ResetPassword): Promise<any> {
    const user = await this.repository.findOne({
      where: { username: input.username },
    });
    if (!user) {
      throw new BadRequestException(`username not found ${input.username}`);
    }

    let uservar;
    const payload = {
      mail: input.username,
      token: undefined,
    };

    //    const {accessToken,token}=await this.createEmailToken(uservar,input);
    const { accessToken, token } = await this.createEmailToken(payload);
    user.passToken = token;
    await this.repository.save(user);

    const mailOptions = {
      from: '"UB: Attendance Tracker" <' + process.env.EMAIL_USER + '>',
      to: '"user" <' + input.username + '@buffalo.edu' + '>',
      subject: 'UB: Attendance Tracker - Password Reset Request',
      text: 'Please change the password using the below attached link.',
      html: `<br><br> Reset Password <br><br>
        <a href='https://webdev.cse.buffalo.edu/attendance/account/changePassword?username=${input.username}&verificationCode=${accessToken}'> Click here to change the password</a>`,
    };

    const sendMailPromise = new Promise<string>((resolve, reject) => {
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.log('Error occurred. ' + err.message);
          reject(err);
        } else {
          const urldata = nodemailer.getTestMessageUrl(info);
          console.log(urldata);
          resolve(urldata);
        }
      });
    });
    const data = await sendMailPromise;

    return { sendMailPromise: data, accessToken };
  }

  async VerifyPassword(input: ForgotPassword): Promise<any> {
    const secretKey = this.configService.get<string>('jwt.publicKey');
    const algorithm = 'HS256'; // The algorithm used for signing the token

    // This is how you can verify the accessToken and extract the mail and token
    const decoded = this.jwtService.verify(input.token, {
      secret: secretKey,
      algorithms: [algorithm], // Specify the algorithm to be used for verification
    });

    const tokenread = decoded.token;

    const user = await this.repository.findOne({
      where: { username: input.username },
    });
    if (!user) {
      throw new BadRequestException('username not found');
    }

    if (user.passToken === tokenread) {
      user.password = input.Newpassword;
      user.password = await hash(user.password, 10);
      await this.repository.save(user);
      return { status: 'password updated' };
    }

    throw new Error('Token not verified');
  }
}
