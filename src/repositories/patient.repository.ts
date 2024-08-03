import { BelongsToAccessor, DefaultCrudRepository, HasManyRepositoryFactory, repository } from '@loopback/repository';
import { Patient, PatientRelations, PatientHistory, Scan, User } from '../models';
import { DbDataSource } from '../datasources';
import { inject, Getter } from '@loopback/core';
import { PatientHistoryRepository } from './patient-history.repository';
import { ScanRepository } from './scans.repository';
import { UserRepository } from './user.repository';

export class PatientRepository extends DefaultCrudRepository<
  Patient,
  typeof Patient.prototype.id,
  PatientRelations
> {
  public readonly patienthistory: HasManyRepositoryFactory<
    PatientHistory,
    typeof Patient.prototype.id
  >;

  public readonly scan: HasManyRepositoryFactory<
    Scan,
    typeof Patient.prototype.id
  >;

  public readonly userId: BelongsToAccessor<
  User,
  typeof Patient.prototype.id
>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('PatientHistoryRepository')
    protected patientHistoryRepositoryGetter: Getter<PatientHistoryRepository>,
    @repository.getter('ScanRepository')
    protected scanRepositoryGetter: Getter<ScanRepository>,
    @repository.getter('UserRepository')
    protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Patient, dataSource);

    this.patienthistory = this.createHasManyRepositoryFactoryFor(
      'history',
      patientHistoryRepositoryGetter,
    );
    this.registerInclusionResolver('history', this.patienthistory.inclusionResolver);

    this.scan = this.createHasManyRepositoryFactoryFor(
      'scan',
      scanRepositoryGetter,
    );
    this.registerInclusionResolver('scan', this.scan.inclusionResolver);

    this.userId = this.createBelongsToAccessorFor('user', userRepositoryGetter);
    this.registerInclusionResolver('user', this.userId.inclusionResolver);
  }
}
