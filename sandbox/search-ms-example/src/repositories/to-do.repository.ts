import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {ToDo} from '../models';
import {DynamicDataSource} from '../datasources';
import {SearchServiceBindings} from '@sourceloop/search-service';

export class ToDoRepository extends DefaultCrudRepository<
  ToDo,
  typeof ToDo.prototype.id
> {
  constructor(
    @inject(`datasources.${SearchServiceBindings.DATASOURCE_NAME}`)
    dataSource: DynamicDataSource,
  ) {
    super(ToDo, dataSource);
  }
}
