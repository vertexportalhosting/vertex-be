import { DefaultCrudRepository, BelongsToAccessor, repository } from '@loopback/repository';
import { Messages, MessagesRelations, User, Case } from '../models';
import { DbDataSource } from '../datasources';
import { inject, Getter } from '@loopback/core';
import { UserRepository } from './user.repository';
import { CaseRepository } from './case.repository';

export class MessagesRepository extends DefaultCrudRepository<
  Messages,
  typeof Messages.prototype.id,
  MessagesRelations
> {

  public readonly userId: BelongsToAccessor<User, typeof Messages.prototype.id>;
  public readonly caseId: BelongsToAccessor<Case, typeof Messages.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('UserRepository')
    protected userRepositoryGetter: Getter<UserRepository>,
    @repository.getter('CaseRepository')
    protected caseRepositoryGetter: Getter<CaseRepository>,
  ) {
    super(Messages, dataSource);

    this.userId = this.createBelongsToAccessorFor('user', userRepositoryGetter);
    this.registerInclusionResolver('user', this.userId.inclusionResolver);

    this.caseId = this.createBelongsToAccessorFor('case', caseRepositoryGetter);
    this.registerInclusionResolver('case', this.caseId.inclusionResolver);
  }
}
