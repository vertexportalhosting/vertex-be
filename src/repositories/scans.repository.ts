import { DefaultCrudRepository, BelongsToAccessor, repository } from '@loopback/repository';
import { Scan, ScanRelations, Patient, User, Case } from '../models';
import { DbDataSource } from '../datasources';
import { inject, Getter } from '@loopback/core';
import { PatientRepository } from './patient.repository';
import { UserRepository } from './user.repository';
import { CaseRepository } from './case.repository';

export class ScanRepository extends DefaultCrudRepository<
  Scan,
  typeof Scan.prototype.id,
  ScanRelations
> {
  public readonly patientId: BelongsToAccessor<Patient, typeof Scan.prototype.id>;
  public readonly userId: BelongsToAccessor<User, typeof Scan.prototype.id>;
  public readonly caseId: BelongsToAccessor<Case, typeof Scan.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('PatientRepository')
    protected patientRepositoryGetter: Getter<PatientRepository>,
    @repository.getter('UserRepository')
    protected userRepositoryGetter: Getter<UserRepository>,
    @repository.getter('CaseRepository')
    protected caseRepositoryGetter: Getter<CaseRepository>,
  ) {
    super(Scan, dataSource);

    this.patientId = this.createBelongsToAccessorFor('patient', patientRepositoryGetter);
    this.registerInclusionResolver('patient', this.patientId.inclusionResolver);

    this.userId = this.createBelongsToAccessorFor('user', userRepositoryGetter);
    this.registerInclusionResolver('user', this.userId.inclusionResolver);

    this.caseId = this.createBelongsToAccessorFor('case', caseRepositoryGetter);
    this.registerInclusionResolver('case', this.caseId.inclusionResolver);
  }
}
