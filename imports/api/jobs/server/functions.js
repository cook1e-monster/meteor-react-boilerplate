import { logger } from '../../logger/server/logger.js'
import { QueueJobs } from '../jobs.js'
import { _ } from 'meteor/underscore'
import moment from 'moment'

QueueJobs.allow({
  admin(userId, method, params) {
    let loggedInUser
    loggedInUser = Meteor.user()
    if (loggedInUser && Roles.userIsInRole(loggedInUser, ['admin', 'staff'])) {
      return true
    }
  }
})

export function addJob(jobName, data, delay) {
  const newJob = new Job(QueueJobs, jobName, data)
  const retries = 1

  newJob.retry({
    retries,
    wait: 60 * 1000
  })

  if (delay) newJob.delay(delay)

  newJob.save()
}

export function cleanIdleJobs() {
  let jobsToRemoveIds, jobsToRestartIds, jobsTypesToRemove
  logger.debug('cleanIdleJobs: called')

  jobsTypesToRemove = [
    'handleTwitterUserTriggers',
    'handleInstagramUserTriggers',
    'destroyTwitterFavorites'
  ]

  jobsToRemoveIds = _.pluck(
    QueueJobs.find(
      {
        status: 'running',
        type: {
          $in: jobsTypesToRemove
        }
      },
      {
        _id: 1
      }
    ).fetch(),
    '_id'
  )

  if (jobsToRemoveIds.length) {
    logger.info('cleanIdleJobs: removing this jobs', { jobsToRemoveIds })
  }

  QueueJobs.cancelJobs(jobsToRemoveIds)
  QueueJobs.removeJobs(jobsToRemoveIds)

  jobsToRestartIds = _.pluck(
    QueueJobs.find(
      {
        status: 'running',
        type: {
          $nin: jobsTypesToRemove
        }
      },
      {
        _id: 1
      }
    ).fetch(),
    '_id'
  )

  if (jobsToRestartIds.length) {
    logger.info('cleanIdleJobs: restarting this jobs', {
      jobsToRestartIds
    })
  }

  QueueJobs.cancelJobs(jobsToRestartIds)

  return QueueJobs.restartJobs(jobsToRestartIds)
}

export function supervisorJobs() {
  reLaunchJobsRunning()
  reLaunchFailJobs()
}

function reLaunchJobsRunning() {
  const ago = moment(moment.now())
    .subtract(5, 'minutes')
    .toDate()

  QueueJobs.find(
    { status: 'running', after: { $lte: ago } },
    { fields: { data: 1, type: 1 } }
  ).forEach(job => {
    addJob(job.type, job.data)
    QueueJobs.remove(job._id)
  })
}

function reLaunchFailJobs() {
  const jobIds = []

  QueueJobs.find(
    { status: 'failed' },
    {
      fields: {
        status: 1,
        log: 1,
        type: 1,
        data: 1
      }
    }
  ).forEach(job => {
    const log = job.log.length ? job.log[job.log.length - 1] : null
    if (!log || !log.message) return

    const regex = /(tunneling socket|Error 504)/g
    const m = regex.exec(log.message)

    if (m && m.length) {
      addJob(job.type, job.data)
      jobIds.push(job._id)
    }
  })

  QueueJobs.removeJobs(jobIds)
}

this.addJobsTest = function() {
  for (let i = 0; i <= 300; i++) {
    addJob(`autoStartJob${i}`, {})
  }
}
