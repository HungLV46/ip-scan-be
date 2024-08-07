import * as exampleJob from './examples/example-job';
import * as exampleBackgroundJob from './background-jobs/background-job-example';
import * as elasticSearchJob from './elastic-search/elastic-search-job';

export function getAllQueues() {
  return [exampleJob.queue, exampleBackgroundJob.queue, elasticSearchJob.queue];
}

export function getAllBackgroundQueues() {
  return [exampleBackgroundJob.queue];
}
