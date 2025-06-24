// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/example-todo-jwt
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { AuthenticationComponent } from '@loopback/authentication';
import {
  JWTAuthenticationComponent,
  MyUserService,
  TokenServiceBindings,
  UserCredentialsRepository,
  UserRepository,
  UserServiceBindings,
} from '@loopback/authentication-jwt';
import { BootMixin } from '@loopback/boot';
import { ApplicationConfig } from '@loopback/core';
import { RepositoryMixin } from '@loopback/repository';
import { RequestBodyParserOptions, RestApplication, RestBindings } from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import { ServiceMixin } from '@loopback/service-proxy';
import path from 'path';
import { DbDataSource } from './datasources';
import { MySequence } from './sequence';
import { PatientHistoryRepository, PatientRepository, ScanRepository } from './repositories';
import { CaseRepository } from './repositories/case.repository';
import { FileUploadController } from './controllers';
export { ApplicationConfig };

export class TodoListApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };

    // ------ ADD SNIPPET AT THE BOTTOM ---------
    // Mount authentication system
    this.component(AuthenticationComponent);
    // Mount jwt component
    this.component(JWTAuthenticationComponent);
    // Bind datasource
    this.dataSource(DbDataSource, UserServiceBindings.DATASOURCE_NAME);
    this.repository(PatientRepository)
    this.repository(PatientHistoryRepository)
    this.repository(ScanRepository)
    this.repository(CaseRepository)
    // ------------- END OF SNIPPET -------------
    //new
    this.bind(TokenServiceBindings.TOKEN_EXPIRES_IN).to('2592000');
    this.bind(UserServiceBindings.USER_SERVICE).toClass(MyUserService);
    this.bind(RestBindings.REQUEST_BODY_PARSER_OPTIONS).to({
      validation: {
        forbiddenKeys: ['_csrf'],
        ajvKeywords: ['range', 'regexp'],
      },
    } as RequestBodyParserOptions);
  }
}
