import { InternalServerErrorException } from '@nestjs/common';
import {
  BadRequestException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { plainToClass } from 'class-transformer';
import * as QRCode from 'qrcode';
import { ReasonsService } from 'src/reasons/reasons.service';
import { ReasonRepository } from 'src/reasons/repositories/reason.repository';
import { Action } from 'src/shared/acl/action.constant';
import { AppLogger } from 'src/shared/logger/logger.service';
import { RequestContext } from 'src/shared/request-context/request-context.dto';
import { UserService } from 'src/user/services/user.service';

import { CreateSpaceInput } from './dto/create-space.dto';
import { SpaceOutput } from './dto/create-space-output';
import {
  MarkSpaceAttendanceInput,
  UpdateSpaceAttendanceReason,
} from './dto/mark-attendance.dto';
import { UpdateSpaceInput } from './dto/update-space.dto';
import { Spaces } from './entities/space.entity';
import { SpaceToUserAttendance } from './entities/spaceToUserAttendance.entity';
import { SpaceRepository } from './repositories/space.repository';
import { SpaceToUserAttendanceRepository } from './repositories/space-attendance.repository';
import { SpaceAclService } from './space-acl.service';

@Injectable()
export class SpacesService {
  path: string;
  webappBaseUrl: string;
  constructor(
    private readonly logger: AppLogger,
    private repository: SpaceRepository,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly spaceToAttendanceRepository: SpaceToUserAttendanceRepository,
    private readonly reasonsService: ReasonsService,
    private readonly ReasonRepository: ReasonRepository,
    private readonly spaceAclService: SpaceAclService,
  ) {
    this.logger.setContext(SpacesService.name);
    this.path = this.configService.get('image.path');
    this.webappBaseUrl = this.configService.get('image.webapp');
  }

  async createSpace(
    ctx: RequestContext,
    input: CreateSpaceInput,
  ): Promise<SpaceOutput> {
    if (!this.spaceAclService.forActor(ctx.user).canDoAction(Action.Create)) {
      throw new UnauthorizedException();
    }

    this.logger.log(ctx, `${this.createSpace.name} was called`);

    const space = plainToClass(Spaces, input);

    this.logger.log(ctx, `calling ${SpaceRepository.name}.saveEvent`);

    const user = await this.userService.findByIdInternal(ctx, ctx.user.id);
    // space.createdBy = user;
    space.isActive = true;

    const savedSpace = await this.repository.save(space);

    await QRCode.toFile(
      `${this.path}/spaces/${savedSpace.id}space.png`,
      `${this.webappBaseUrl}/attendance/spaces/markAttendance?id=${savedSpace.id}`,
      {
        type: 'png',
      },
    );
    const found = await this.repository.findOne({
      where: { id: savedSpace.id },
    });

    found.qr = `${this.webappBaseUrl}/static/images/qr/spaces/${savedSpace.id}space.png`;

    await this.repository.save(found);

    return plainToClass(SpaceOutput, savedSpace, {
      excludeExtraneousValues: true,
    });
  }

  async markAttendance(ctx: RequestContext, input: MarkSpaceAttendanceInput) {
    const user = await this.userService.findByIdInternal(ctx, ctx.user.id);
    const space = await this.repository.findOne({
      where: { id: input.spaceId },
    });

    if (!space) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'No such space exists',
      });
    }

    if (!space.isActive) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Space is inactive',
      });
    }

    if (user && space) {
      const save = await this.spaceToAttendanceRepository.save({
        attended: true,
        space: space,
        user: user,
        reason: null,
      });
      return save;
    }
  }

  async updateSpaceAttendance(
    ctx: RequestContext,
    input: UpdateSpaceAttendanceReason,
  ) {
    if (!this.spaceAclService.forActor(ctx.user).canDoAction(Action.Update)) {
      throw new UnauthorizedException();
    }

    const user = await this.userService.findByIdInternal(ctx, ctx.user.id);
    const attendance = await this.spaceToAttendanceRepository.getById(
      input.attendanceId,
    );

    if (!user || !attendance) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'space or user does not exist',
      });
    }

    const reason = await this.reasonsService.findOneById(input.reasonId);
    if (!reason) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Invalid Reason Code',
      });
    }
    attendance.reason = reason;
    return await this.spaceToAttendanceRepository.save(attendance);
  }

  async listAllSpaces(ctx: RequestContext, limit: number, offset: number) {
    this.logger.log(ctx, `${this.listAllSpaces.name} was called`);

    const [spaces, count] = await this.repository.findAndCount({
      where: {},
      take: limit,
      skip: offset,
    });

    return { spaces: spaces, count };
  }

  async getSpaceById(ctx: RequestContext, id: number): Promise<Spaces> {
    this.logger.log(ctx, `${this.getSpaceById.name} was called`);

    this.logger.log(ctx, `calling ${SpaceRepository.name}.getEventById`);

    const event = await this.repository.getById(id);

    // delete event.createdBy.password;

    return event;
  }

  async deleteSpace(ctx: RequestContext, id: number): Promise<SpaceOutput> {
    if (!this.spaceAclService.forActor(ctx.user).canDoAction(Action.Delete)) {
      throw new UnauthorizedException();
    }
    this.logger.log(ctx, `${this.deleteSpace.name} was called`);

    const user = await this.userService.findByIdInternal(ctx, ctx.user.id);
    const space = await this.repository.getById(id);
    // space.createdBy = user;

    //this.repository.softDelete({ id });
    this.repository.delete({ id });
    const attendance = await this.spaceToAttendanceRepository.find({
      where: { spaceId: id },
    });

    if (attendance.length > 1) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Cannot delete space as there is attendance attached to it.',
      });
    }

    this.repository.softDelete({ id });
    //this.repository.delete({ id })

    return plainToClass(SpaceOutput, space, {
      excludeExtraneousValues: true,
    });
  }

  async restoreSpace(ctx: RequestContext, id: number): Promise<SpaceOutput> {
    this.logger.log(ctx, `${this.restoreSpace.name} was called`);

    //const user = await this.userService.findByIdInternal(ctx, ctx.user.id);
    // space.createdBy = user;

    const space = await this.repository.restore({ id });
    //this.repository.delete({ id })

    return plainToClass(SpaceOutput, space, {
      excludeExtraneousValues: true,
    });
  }

  // async updateSpaceReason() {}

  async updateSpace(
    eventId: number,
    input: UpdateSpaceInput,
    ctx: RequestContext,
  ) {
    console.log(ctx, 'ctxx');
    if (!this.spaceAclService.forActor(ctx.user).canDoAction(Action.Update)) {
      throw new UnauthorizedException();
    }
    const events = await this.repository.getById(eventId);

    const updatedEvent: Spaces = {
      ...events,
      ...plainToClass(Spaces, input),
    };

    const updateResult = await this.repository.save(updatedEvent);

    return plainToClass(SpaceOutput, updateResult, {
      excludeExtraneousValues: true,
    });
  }

  async deleteReason(id: number) {
    const reason = await this.reasonsService.findOneById(id);
    if (!reason) {
      throw new Error('Reason not found');
    }
    const affiliationToUserIds = await this.spaceToAttendanceRepository
      .createQueryBuilder('spaceToUserAttendance')
      .select('spaceToUserAttendance.spaceToUserAttendanceId')
      .where('spaceToUserAttendance.reason = :reasonId', { reasonId: id })
      .getOne();

    console.log(affiliationToUserIds);

    if (!affiliationToUserIds) {
      //      throw new Error("not implemented")

      const deletereason = await this.reasonsService.deleteReason(id);
      console.log(deletereason);

      return ' Reason Deleted';
    } else {
      reason.isActive = false;
      const upreason = await this.ReasonRepository.save(reason);
      console.log(upreason);
      return 'Reason is Disabled';
    }
  }

  async deleteAdminSpace(id: number) {
    const space = await this.repository.getById(id);
    if (!space) {
      throw new Error('Space not found');
    }
    const affiliationToUserIds = await this.spaceToAttendanceRepository
      .createQueryBuilder('spaceToUserAttendance')
      .select('spaceToUserAttendance.spaceToUserAttendanceId')
      .where('spaceToUserAttendance.space = :spaceId', { spaceId: id })
      .getOne();

    console.log(affiliationToUserIds);

    if (!affiliationToUserIds) {
      //      throw new Error("not implemented")

      const deletereason = await this.repository.delete({ id });
      console.log(deletereason);

      return ' Space Deleted';
    } else {
      // space.isActive = false
      // const upreason =await this.repository.save(space)
      //console.log(upreason)
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Space cannot be deleted',
      });
    }
  }
}
