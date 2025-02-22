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
  del,
  requestBody,
} from '@loopback/rest';
import {Subscriptions} from '../models';
import {STATUS_CODE} from '@sourceloop/core';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {PermissionKey} from '../enums/permission-key.enum';
import {SubscriptionsRepository} from '../repositories';
const subscriptionsRoutePath = '/subscriptions';
const subscriptionsIdRoutePath = '/subscriptions/{id}';

export class SubscriptionsController {
  constructor(
    @repository(SubscriptionsRepository)
    public subscriptionsRepository: SubscriptionsRepository,
  ) {}

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.CreateSubscription]})
  @post(subscriptionsRoutePath, {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Subscriptions model instance',
        content: {
          'application/json': {schema: getModelSchemaRef(Subscriptions)},
        },
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Subscriptions, {
            title: 'NewSubscriptions',
          }),
        },
      },
    })
    subscriptions: Subscriptions,
  ): Promise<Subscriptions> {
    return this.subscriptionsRepository.create(subscriptions);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.GetSubscriptionCount]})
  @get('/subscriptions/count', {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Subscriptions model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Subscriptions) where?: Where<Subscriptions>,
  ): Promise<Count> {
    return this.subscriptionsRepository.count(where);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.GetSubscriptions]})
  @get(subscriptionsRoutePath, {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Array of Subscriptions model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Subscriptions, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Subscriptions) filter?: Filter<Subscriptions>,
  ): Promise<Subscriptions[]> {
    return this.subscriptionsRepository.find(filter);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.UpdateSubscriptions]})
  @patch(subscriptionsRoutePath, {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Subscriptions PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Subscriptions, {partial: true}),
        },
      },
    })
    subscriptions: Subscriptions,
    @param.where(Subscriptions) where?: Where<Subscriptions>,
  ): Promise<Count> {
    return this.subscriptionsRepository.updateAll(subscriptions, where);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.GetSubscriptions]})
  @get(subscriptionsIdRoutePath, {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Subscriptions model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Subscriptions, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Subscriptions, {exclude: 'where'})
    filter?: FilterExcludingWhere<Subscriptions>,
  ): Promise<Subscriptions> {
    return this.subscriptionsRepository.findById(id, filter);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.UpdateSubscriptions]})
  @patch(subscriptionsIdRoutePath, {
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Subscriptions PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Subscriptions, {partial: true}),
        },
      },
    })
    subscriptions: Subscriptions,
  ): Promise<void> {
    await this.subscriptionsRepository.updateById(id, subscriptions);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.UpdateSubscriptions]})
  @put(subscriptionsIdRoutePath, {
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Subscriptions PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() subscriptions: Subscriptions,
  ): Promise<void> {
    await this.subscriptionsRepository.replaceById(id, subscriptions);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.DeleteSubscriptions]})
  @del(subscriptionsIdRoutePath, {
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Subscriptions DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.subscriptionsRepository.deleteById(id);
  }
}
