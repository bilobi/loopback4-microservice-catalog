import {
  Binding,
  Component,
  ControllerClass,
  CoreBindings,
  inject,
  ProviderMap,
} from '@loopback/core';
import {Class, Model, Repository} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  BearerVerifierBindings,
  BearerVerifierComponent,
  BearerVerifierConfig,
  BearerVerifierType,
  CoreComponent,
  SECURITY_SCHEME_SPEC,
  ServiceSequence,
} from '@sourceloop/core';
import {AuthenticationComponent} from 'loopback4-authentication';
import {
  AuthorizationBindings,
  AuthorizationComponent,
} from 'loopback4-authorization';
import {StrategyBindings, ToggleServiceBindings} from './keys';
import {
  Features,
  Parameters,
  Projects,
  Strategies,
  StrategiesType,
} from './models';
import {
  FeaturesRepository,
  ProjectsRepository,
  StrategiesRepository,
} from './repositories';
import {
  FeatureFlagActionProvider,
  FeatureFlagMetadataProvider,
  SystemFeatureProvider,
  TenantFeatureProvider,
  UserFeatureProvider,
} from './providers';
import {IToggleServiceConfig} from './types';
import {
  FeaturesController,
  ProjectsController,
  StrategiesController,
} from './controllers';
import {FeatureToggleActionMiddlewareInterceptor} from './middlewares';

export class FeatureToggleServiceComponent implements Component {
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE)
    private readonly application: RestApplication,
    @inject(ToggleServiceBindings.Config, {optional: true})
    private readonly config?: IToggleServiceConfig,
  ) {
    this.bindings = [];

    // Mount core component
    this.application.component(CoreComponent);

    this.application.api({
      openapi: '3.0.0',
      info: {
        title: 'Feature Toggle Service',
        version: '1.0.0',
      },
      paths: {},
      components: {
        securitySchemes: SECURITY_SCHEME_SPEC,
      },
      servers: [{url: '/'}],
    });

    this.application.middleware(FeatureToggleActionMiddlewareInterceptor);
    // Mount default sequence if needed
    if (!this.config?.useCustomSequence) {
      // Mount default sequence if needed
      this.setupSequence();
    }
    this.repositories = [
      FeaturesRepository,
      ProjectsRepository,
      StrategiesRepository,
    ];

    this.models = [Features, Parameters, Projects, Strategies, StrategiesType];
    this.providers = {
      [StrategyBindings.FEATURE_FLAG_ACTION.key]: FeatureFlagActionProvider,
      [StrategyBindings.METADATA.key]: FeatureFlagMetadataProvider,
      [StrategyBindings.TENANT_FEATURE.key]: TenantFeatureProvider,
      [StrategyBindings.USER_FEATURE.key]: UserFeatureProvider,
      [StrategyBindings.SYSTEM_FEATURE.key]: SystemFeatureProvider,
    };

    if (this.config?.bindControllers) {
      this.controllers = [
        FeaturesController,
        ProjectsController,
        StrategiesController,
      ];
    }
  }
  providers?: ProviderMap = {};

  bindings?: Binding[] = [];
  /**
   * An optional list of Repository classes to bind for dependency injection
   * via `app.repository()` API.
   */
  repositories?: Class<Repository<Model>>[];

  /**
   * An optional list of Model classes to bind for dependency injection
   * via `app.model()` API.
   */
  models?: Class<Model>[];

  /**
   * An array of controller classes
   */
  controllers?: ControllerClass[];
  setupSequence() {
    this.application.sequence(ServiceSequence);

    // Mount authentication component for default sequence
    this.application.component(AuthenticationComponent);
    // Mount bearer verifier component
    this.application.bind(BearerVerifierBindings.Config).to({
      authServiceUrl: '',
      type: BearerVerifierType.service,
    } as BearerVerifierConfig);
    this.application.component(BearerVerifierComponent);

    // Mount authorization component for default sequence
    this.application.bind(AuthorizationBindings.CONFIG).to({
      allowAlwaysPaths: ['/explorer'],
    });
    this.application.component(AuthorizationComponent);
  }
}
