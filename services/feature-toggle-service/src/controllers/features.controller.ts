import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  requestBody,
  del,
} from '@loopback/rest';
import {
  CONTENT_TYPE,
  OPERATION_SECURITY_SPEC,
  STATUS_CODE,
} from '@sourceloop/core';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {PermissionKey} from '../enums';
import {Features} from '../models';
import {FeaturesRepository} from '../repositories';

const basePath = '/features';
export class FeaturesController {
  constructor(
    @repository(FeaturesRepository)
    public featuresRepository: FeaturesRepository,
  ) {}

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.CreateFeature]})
  @post(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Features model instance',
        content: {[CONTENT_TYPE.JSON]: {schema: getModelSchemaRef(Features)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Features, {
            title: 'NewFeatures',
          }),
        },
      },
    })
    features: Features,
  ): Promise<Features> {
    return this.featuresRepository.create(features);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.ViewFeature]})
  @get(`${basePath}/count`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Features model count',
        content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
      },
    },
  })
  async count(@param.where(Features) where?: Where<Features>): Promise<Count> {
    return this.featuresRepository.count(where);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.ViewFeature]})
  @get(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Array of Features model instances',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Features, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Features) filter?: Filter<Features>,
  ): Promise<Features[]> {
    return this.featuresRepository.find(filter);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.UpdateFeature]})
  @patch(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Features PATCH success count',
        content: {
          [CONTENT_TYPE.JSON]: {schema: CountSchema},
        },
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Features, {partial: true}),
        },
      },
    })
    features: Features,
    @param.where(Features) where?: Where<Features>,
  ): Promise<Count> {
    return this.featuresRepository.updateAll(features, where);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.ViewFeature]})
  @get(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Features model instance',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: getModelSchemaRef(Features, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Features, {exclude: 'where'})
    filter?: FilterExcludingWhere<Features>,
  ): Promise<Features> {
    return this.featuresRepository.findById(id, filter);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.UpdateFeature]})
  @patch(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Features PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Features, {partial: true}),
        },
      },
    })
    features: Features,
  ): Promise<void> {
    await this.featuresRepository.updateById(id, features);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.UpdateFeature]})
  @put(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Features PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() features: Features,
  ): Promise<void> {
    await this.featuresRepository.replaceById(id, features);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.DeleteFeature]})
  @del(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Features DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.featuresRepository.deleteById(id);
  }
}
