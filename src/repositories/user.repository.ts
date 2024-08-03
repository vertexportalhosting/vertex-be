import {
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  repository,
} from '@loopback/repository';
import { User, PatientHistory, Scan } from '../models';
import { inject, Getter } from '@loopback/core';
import { DbDataSource } from '../datasources';
import { PatientHistoryRepository } from './patient-history.repository';
import { ScanRepository } from './scans.repository'; // Correct import
import { UserCredentialsRepository } from '@loopback/authentication-jwt';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id
> {
  public readonly updatedHistories: HasManyRepositoryFactory<
    PatientHistory,
    typeof User.prototype.id
  >;

  public readonly uploadedDocuments: HasManyRepositoryFactory<
    Scan,
    typeof User.prototype.id
  >;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('PatientHistoryRepository')
    protected patientHistoryRepositoryGetter: Getter<PatientHistoryRepository>,
    @repository.getter('ScanRepository')
    protected documentRepositoryGetter: Getter<ScanRepository>, // Corrected getter name
  ) {
    super(User, dataSource);

    this.updatedHistories = this.createHasManyRepositoryFactoryFor(
      'updatedHistories',
      patientHistoryRepositoryGetter,
    );
    this.registerInclusionResolver('updatedHistories', this.updatedHistories.inclusionResolver);

    this.uploadedDocuments = this.createHasManyRepositoryFactoryFor(
      'uploadedDocuments',
      documentRepositoryGetter,
    );
    this.registerInclusionResolver('uploadedDocuments', this.uploadedDocuments.inclusionResolver);
  }
}
