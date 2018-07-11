import { logger } from '/imports/api/logger/server/logger'
import { _ } from 'meteor/underscore'

import { addJob, supervisorJobs } from './functions.js'
import { QueueJobs } from '../jobs.js'
import { jobs } from './startupJob'

// check activities
QueueJobs.processJobs('autoStartJob', { concurrency: 2, pollInterval: 2500 }, function(
  job,
  callback
) {
  logger.debug('called autoStartWorker')

  try {
    // check if exists jobs
    jobs.forEach(job => {
      const queueJob = QueueJobs.findOne({ type: job.type }, { fields: { _id: 1, status: 1 } })

      if (!queueJob) {
        logger.debug('create job ', job.type)
        const query = job.query ? job.query : {}

        // call autostart job
        addJob(job.type, query, job.delay)
      }
    })

    job.done()
    job.remove()
    addJob('autoStartJob', {}, 3600000)
  } catch (error) {
    logger.warn('autoStartWorker: fail', { error })
    job.fail(error)
  }

  callback(null)
})

QueueJobs.processJobs('supervisorJobs', { concurrency: 2, pollInterval: 2500 }, function(
  job,
  callback
) {
  logger.debug('called supervisorJobs')

  try {
    supervisorJobs()

    job.done()
    job.remove()
  } catch (error) {
    logger.warn('supervisorJobs: fail', { error })
    job.fail(`${error}`)
  }

  callback(null)
})
