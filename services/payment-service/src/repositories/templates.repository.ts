import {inject} from '@loopback/core';
import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {PaymentDatasourceName} from '../keys';
import {Templates} from '../models';

export class TemplatesRepository extends DefaultCrudRepository<
  Templates,
  typeof Templates.prototype.id
> {
  constructor(
    @inject(`datasources.${PaymentDatasourceName}`)
    dataSource: juggler.DataSource,
  ) {
    super(Templates, dataSource);
  }
}
