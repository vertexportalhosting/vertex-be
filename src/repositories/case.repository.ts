import {
  BelongsToAccessor,
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  HasOneRepositoryFactory,
  repository,
} from '@loopback/repository';
import {Patient, Case, CaseRelations, User, Scan} from '../models';
import {DbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {PatientRepository} from './patient.repository';
import {UserRepository} from './user.repository';
import {ScanRepository} from './scans.repository';

export class CaseRepository extends DefaultCrudRepository<
  Case,
  typeof Case.prototype.id,
  CaseRelations
> {
  public readonly patientId: BelongsToAccessor<
    Patient,
    typeof Case.prototype.id
  >;
  public readonly userId: BelongsToAccessor<User, typeof Case.prototype.id>;
  public readonly scan: HasManyRepositoryFactory<
    Scan,
    typeof Patient.prototype.id
  >;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('PatientRepository')
    protected patientRepositoryGetter: Getter<PatientRepository>,
    @repository.getter('UserRepository')
    protected userRepositoryGetter: Getter<UserRepository>,
    @repository.getter('ScanRepository')
    protected scanRepositoryGetter: Getter<ScanRepository>,
  ) {
    super(Case, dataSource);

    this.patientId = this.createBelongsToAccessorFor(
      'patient',
      patientRepositoryGetter,
    );
    this.registerInclusionResolver('patient', this.patientId.inclusionResolver);

    this.userId = this.createBelongsToAccessorFor('user', userRepositoryGetter);
    this.registerInclusionResolver('user', this.userId.inclusionResolver);

    this.scan = this.createHasManyRepositoryFactoryFor(
      'scan',
      scanRepositoryGetter,
    );
    this.registerInclusionResolver('scan', this.scan.inclusionResolver);
  }
}
