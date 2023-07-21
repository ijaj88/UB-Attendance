//src/article/services/article-acl.service.ts

import { Injectable } from '@nestjs/common';
import { ROLE } from 'src/auth/constants/role.constant';
import { BaseAclService } from 'src/shared/acl/acl.service';
import { Action } from 'src/shared/acl/action.constant';

import { Events } from './entities/event.entity';

@Injectable()
export class EventAclService extends BaseAclService<Events> {
  constructor() {
    super();
    this.canDo(ROLE.ADMIN, [Action.Manage]);
    this.canDo(ROLE.PRESENTER, [Action.Manage]);
    this.canDo(ROLE.ASSISTANT, [Action.Manage]);
    this.canDo(ROLE.USER, [Action.List]);
  }
}
