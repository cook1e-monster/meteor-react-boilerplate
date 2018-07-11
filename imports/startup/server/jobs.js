import { Meteor } from 'meteor/meteor'
import { QueueJobs } from '/imports/api/jobs/jobs.js'
import { addJob } from '/imports/api/jobs/server/functions.js'
import { logger } from '/imports/api/logger/server/logger.js'

Meteor.startup(function() {
  logger.info('Startup Queue Jobs Server')
  QueueJobs.startJobServer()

  if (!QueueJobs.findOne({ type: 'autoStartJob' }, {})) addJob('autoStartJob', {})
})
