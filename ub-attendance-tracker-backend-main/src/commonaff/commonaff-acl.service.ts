import { Injectable } from '@nestjs/common';
import { ROLE } from 'src/auth/constants/role.constant';
import { BaseAclService } from 'src/shared/acl/acl.service';
import { Action } from 'src/shared/acl/action.constant';

import { Affiliation } from '../affiliation/entities/affiliation.entity'

@Injectable()
export class AffiliationAclService extends BaseAclService<Affiliation> {
  constructor() {
    super();
    this.canDo(ROLE.ADMIN, [Action.Manage]);
    this.canDo(ROLE.ASSISTANT, [Action.Create, Action.Update, Action.Delete]);
    this.canDo(ROLE.USER, [Action.List]);
  }
}
