import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { plainToClass } from 'class-transformer';
import * as QRCode from 'qrcode';
import { NotFoundError } from 'rxjs';
import { Action } from 'src/shared/acl/action.constant';
import { AppLogger } from 'src/shared/logger/logger.service';
import { RequestContext } from 'src/shared/request-context/request-context.dto';
import { buildQuery } from 'src/shared/request-context/util';
import { SpacesService } from 'src/spaces/spaces.service';
import { UserService } from 'src/user/services/user.service';
import { EntityManager } from 'typeorm';

import { SpaceRepository } from './../spaces/repositories/space.repository';
import { CreateEventInput } from './dto/create-event.dto';
import { EventOutput } from './dto/create-event-output';
import { CreateEventSeries } from './dto/create-eventSeries.dto';
import { EventStatQuery } from './dto/event-stats.dto';
import {
  EventAction,
  MarkEventAttendanceInput,
} from './dto/mark-attendance.dto';
import { UpdateEventInput } from './dto/update-event.dto';
import { DisableEventSpace } from './dto/update-event.dto';
import { Events } from './entities/event.entity';
import { EventSeries } from './entities/eventSeries.entity';
import { EventToUserAttendance } from './entities/eventToUserAttendance.entity';
import { EventAclService } from './event-acl.service';
import { EventRepository } from './repositories/event.repository';
import { EventStatsRepository } from './repositories/events-stats.repository';
import { EventSeriesRepository } from './repositories/eventSeries.repository';
import { EventToUserAttendanceRepository } from './repositories/eventToUserAttendance.repository';

@Injectable()
export class EventsService {
  path: string;
  webappBaseUrl: string;
  constructor(
    private readonly logger: AppLogger,
    private repository: EventRepository,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly spacesService: SpacesService,
    private readonly eventSeriesRepository: EventSeriesRepository,
    private readonly eventToUserAttendanceRepository: EventToUserAttendanceRepository,
    private readonly entityManager: EntityManager,
    private readonly eventStatsRepositoty: EventStatsRepository,
    private readonly SpaceRepository: SpaceRepository,
    private readonly eventsAclService: EventAclService,
  ) {
    this.logger.setContext(EventsService.name);
    this.path = this.configService.get('image.path');
    this.webappBaseUrl = this.configService.get('image.webapp');
  }

  async createEvent(
    ctx: RequestContext,
    input: CreateEventInput,
  ): Promise<EventOutput> {
    this.logger.log(ctx, `${this.createEvent.name} was called`);

    if (!this.eventsAclService.forActor(ctx.user).canDoAction(Action.Create)) {
      throw new UnauthorizedException();
    }

    const event = plainToClass(Events, input);

    if (input.spacesId) {
      const spaces = await this.spacesService.getSpaceById(ctx, input.spacesId);
      if (!spaces) {
        throw new NotFoundError('Space not found');
      }
      event.spaces = spaces;
    }

    if (input.series) {
      const series = await this.eventSeriesRepository.getById(input.series);
      if (!series) {
        throw new NotFoundError('Series not found');
      }
      event.series = series;
    }

    this.logger.log(ctx, `calling ${EventRepository.name}.saveEvent`);

    const user = await this.userService.findByIdInternal(ctx, ctx.user.id);
    event.createdBy = user;

    if (input.spacesId) {
      const spaces = await this.spacesService.getSpaceById(ctx, input.spacesId);
      event.spaces = spaces;
    }
    event.isActive = true;
    const savedEvent = await this.repository.save(event);

    await QRCode.toFile(
      `${this.path}/event/${savedEvent.id}.png`,
      `${this.webappBaseUrl}/attendance/events/markAttendance?id=${savedEvent.id}`,
      {
        type: 'png',
      },
    );

    const found = await this.repository.findOne({
      where: { id: savedEvent.id },
    });

    found.qr = `${this.webappBaseUrl}/static/images/qr/event/${savedEvent.id}.png`;

    await this.repository.save(found);

    return plainToClass(EventOutput, savedEvent, {
      excludeExtraneousValues: true,
    });
  }

  async getEventById(ctx: RequestContext, id: number): Promise<Events> {
    this.logger.log(ctx, `${this.createEvent.name} was called`);

    if (!this.eventsAclService.forActor(ctx.user).canDoAction(Action.Read)) {
      throw new UnauthorizedException();
    }

    this.logger.log(ctx, `calling ${EventRepository.name}.getEventById`);

    const event = await this.repository.getById(id);

    delete event.createdBy.password;

    return event;
  }
  async deleteEventById(ctx: RequestContext, id: number): Promise<any> {
    this.logger.log(ctx, `${this.deleteEventById.name} was called`);

    if (!this.eventsAclService.forActor(ctx.user).canDoAction(Action.Delete)) {
      throw new UnauthorizedException();
    }

    this.logger.log(ctx, `calling ${EventRepository.name}.deleteEventById`);

    const event = await this.repository.getById(id);
    const affiliationToUserIds = await this.eventToUserAttendanceRepository
      .createQueryBuilder('eventToUserAttendance')
      .where('eventToUserAttendance.eventId = :evId', { evId: id })
      .getOne();

    if (!affiliationToUserIds) {
      const deletereason = await this.repository.delete({ id });
      console.log(deletereason);
      return ' Event Deleted';
    } else {
      //event.isActive = false
      //const upreason =await this.repository.save(event)
      //console.log(upreason)
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Event cannot be deleted',
      });
    }
    // just retrieving the avaialble events
    const attendance = await this.eventToUserAttendanceRepository.find({
      where: {
        eventId: id,
      },
    });

    if (attendance.length > 1) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Cannot Delete Event as there is attendance linked to it',
      });
    }
    await this.repository.delete({ id });
    return event;
  }

  async listAllEventStats() {
    return await this.eventStatsRepositoty.find({});
  }

  async executeQuery(
    statsId: number,
    queryParam: EventStatQuery,
    ctx: RequestContext,
  ) {
    if (!this.eventsAclService.forActor(ctx.user).canDoAction(Action.Manage)) {
      throw new UnauthorizedException();
    }
    const stat = await this.eventStatsRepositoty.findOne({
      where: { id: statsId },
    });

    if (!stat)
      throw new BadRequestException('Stat not Found. Enter a valid stat ID');
    // const query = `SELECT YEAR(t.createdAt) AS year, MONTH(t.createdAt) AS month, DAY(t.createdAt) AS day, COUNT(t.userId) AS total_attendees FROM \`event_to_user_attendance\` t JOIN \`users\` u ON t.userId = u.id JOIN \`events\` e ON t.eventId = e.id WHERE t.eventId = 1 AND t.attended = 1 GROUP BY YEAR(t.createdAt), MONTH(t.createdAt), DAY(t.createdAt)`;
    // console.log(queryParam, 'queryParams');
    // console.log(queryParam.toTimestamp, 'toooo');
    const query = buildQuery(stat.query, queryParam);

    console.log(query, 'qqqqqqq');

    const result = await this.entityManager.query(query);

    return result;
  }

  async getUserEventHistory(ctx: RequestContext) {
    this.logger.log(ctx, `${this.getUserEventHistory.name} was called`);

    const history = await this.eventToUserAttendanceRepository
      .createQueryBuilder('event_to_user_attendance')
      .where('event_to_user_attendance.userId = :id', { id: ctx.user.id })
      .leftJoinAndSelect('event_to_user_attendance.event', 'event')
      // .addFrom('events', 'spaces')
      .getMany();

    return history;
  }

  async createNewSeries(input: CreateEventSeries, ctx: RequestContext) {
    if (!this.eventsAclService.forActor(ctx.user).canDoAction(Action.Create)) {
      throw new UnauthorizedException();
    }
    const eventSeries = plainToClass(EventSeries, input);
    const savedSeries = await this.eventSeriesRepository.save(eventSeries);
    return savedSeries;
  }

  async listAllEventSeries() {
    return await this.eventSeriesRepository.find({});
  }

  async getEvents(ctx: RequestContext, limit: number, offset: number) {
    this.logger.log(ctx, `${this.getEvents.name} was called`);

    this.logger.log(ctx, `calling ${EventRepository.name}.findAndCount`);

    const [events, count] = await this.repository.findAndCount({
      where: {},
      relations: { createdBy: true, spaces: true, series: true },
      take: limit,
      skip: offset,
    });

    for (const event of events) {
      if (event && event.createdBy && event.createdBy.password) {
        delete event.createdBy.password;
      }
    }

    return { events: events, count };
  }

  async updateEvent(
    eventId: number,
    input: UpdateEventInput,
    ctx: RequestContext,
  ) {
    if (!this.eventsAclService.forActor(ctx.user).canDoAction(Action.Update)) {
      throw new UnauthorizedException();
    }
    const events = await this.repository.getById(eventId);
    if (input.spacesId) {
      const spaces = await this.SpaceRepository.getById(input.spacesId);
      if (!spaces) {
        throw new NotFoundError('Space not found');
      }
      events.spaces = spaces;
    } else {
      events.spaces = null;
    }

    if (input.series) {
      const series = await this.eventSeriesRepository.getById(input.series);
      if (!series) {
        throw new NotFoundError('Series not found');
      }
      events.series = series;
    } else {
      events.series = null;
    }

    const updatedEvent: Events = {
      ...events,
      ...plainToClass(Events, input),
    };

    const updateResult = await this.repository.save(updatedEvent);

    return plainToClass(EventOutput, updateResult, {
      excludeExtraneousValues: true,
    });
  }

  async markAttendance(ctx: RequestContext, input: MarkEventAttendanceInput) {
    this.logger.log(ctx, `${this.markAttendance.name} was called`);

    const user = await this.userService.findByIdInternal(ctx, ctx.user.id);
    const event = await this.repository.findOne({
      where: { id: input.eventId },
    });

    if (!event) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'No such event exists',
      });
    }

    if (!event.isActive) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Event is Inactive. Cannot mark attendance',
      });
    }

    if (!user || !event) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'User or event does not exist',
      });
    }

    const hasAttended = await this.eventToUserAttendanceRepository.findOne({
      where: { userId: user.id, eventId: event.id },
    });

    if (hasAttended) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Already attended event',
      });
    }

    const save = await this.eventToUserAttendanceRepository.save({
      attended: input.action === EventAction.ATTEND ? true : false,
      event: event,
      rsvp: false,
      user: user,
    });
    return save;
  }
  async deleteSpaceById(ctx: RequestContext, id: number): Promise<any> {
    this.logger.log(ctx, `${this.deleteEventById.name} was called`);

    if (!this.eventsAclService.forActor(ctx.user).canDoAction(Action.Delete)) {
      throw new UnauthorizedException();
    }
    const affiliationToUserIds = await this.repository
      .createQueryBuilder('event')
      .where('event.spaces = :spaceId', { spaceId: id })
      .getOne();
    if (affiliationToUserIds) {
      console.log(affiliationToUserIds);
      const space = await this.SpaceRepository.getById(id);
      //space.isActive = false
      //await this.SpaceRepository.save(space)
      const val = affiliationToUserIds.id;
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Space cannot be deleted Linked to Event',
      });
    }

    return await this.spacesService.deleteAdminSpace(id);
  }

  async deleteReasonById(ctx: RequestContext, id: number): Promise<any> {
    this.logger.log(ctx, `${this.deleteEventById.name} was called`);

    if (!this.eventsAclService.forActor(ctx.user).canDoAction(Action.Delete)) {
      throw new UnauthorizedException();
    }
    return await this.spacesService.deleteReason(id);
  }
  async disableEvent(
    ctx: RequestContext,
    id: number,
    input: DisableEventSpace,
  ): Promise<any> {
    if (!this.eventsAclService.forActor(ctx.user).canDoAction(Action.Delete)) {
      throw new UnauthorizedException();
    }

    const event = await this.repository.getById(id);
    event.isActive = input.isActive;
    return await this.repository.save(event);
  }

  async disableSpace(
    ctx: RequestContext,
    id: number,
    input: DisableEventSpace,
  ): Promise<any> {
    if (!this.eventsAclService.forActor(ctx.user).canDoAction(Action.Delete)) {
      throw new UnauthorizedException();
    }

    const space = await this.SpaceRepository.getById(id);
    space.isActive = input.isActive;
    return await this.SpaceRepository.save(space);
  }
}
