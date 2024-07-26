import * as exampleJob from './examples/example-job';
import * as exampleBackgroundJob from './background-jobs/background-job-example';

export function getAllQueues() {
  return [exampleJob.queue, exampleBackgroundJob.queue];
}

export function getAllBackgroundQueues() {
  return [exampleBackgroundJob.queue];
}
