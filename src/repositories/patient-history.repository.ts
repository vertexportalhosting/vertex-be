import { DefaultCrudRepository, BelongsToAccessor, repository } from '@loopback/repository';
import { PatientHistory, PatientHistoryRelations, Patient, User, Case } from '../models';
import { DbDataSource } from '../datasources';
import { inject, Getter } from '@loopback/core';
import { PatientRepository } from './patient.repository';
import { UserRepository } from './user.repository';
import { CaseRepository } from './case.repository';

export class PatientHistoryRepository extends DefaultCrudRepository<
  PatientHistory,
  typeof PatientHistory.prototype.id,
  PatientHistoryRelations
> {
  public readonly patient: BelongsToAccessor<Patient, typeof PatientHistory.prototype.id>;
  public readonly updatedBy: BelongsToAccessor<User, typeof PatientHistory.prototype.id>;
  public readonly case: BelongsToAccessor<Case, typeof PatientHistory.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('PatientRepository')
    protected patientRepositoryGetter: Getter<PatientRepository>,
    @repository.getter('UserRepository')
    protected userRepositoryGetter: Getter<UserRepository>,
    @repository.getter('CaseRepository')
    protected caseRepositoryGetter: Getter<CaseRepository>,
  ) {
    super(PatientHistory, dataSource);

    this.patient = this.createBelongsToAccessorFor('patient', patientRepositoryGetter);
    this.registerInclusionResolver('patient', this.patient.inclusionResolver);

    this.updatedBy = this.createBelongsToAccessorFor('user', userRepositoryGetter);
    this.registerInclusionResolver('user', this.updatedBy.inclusionResolver);

    this.case = this.createBelongsToAccessorFor('case', caseRepositoryGetter);
    this.registerInclusionResolver('case', this.case.inclusionResolver);
  }
}
