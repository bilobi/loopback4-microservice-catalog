import {
  inject,
  lifeCycleObserver,
  LifeCycleObserver,
  ValueOrPromise,
} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'notifDb',
  connector: 'memory',
  localStorage: '',
  file: '',
};

@lifeCycleObserver('datasource')
export class NotificationDbCacheDataSource
  extends juggler.DataSource
  implements LifeCycleObserver
{
  static dataSourceName = 'NotifAccessCache';

  constructor(
    @inject('datasources.config.NotifAccessCache', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }

  /**
   * Start the datasource when application is started
   */
  start(): ValueOrPromise<void> {
    // Add your logic here to be invoked when the application is started
  }

  /**
   * Disconnect the datasource when application is stopped. This allows the
   * application to be shut down gracefully.
   */
  stop(): ValueOrPromise<void> {
    return super.disconnect();
  }
}
