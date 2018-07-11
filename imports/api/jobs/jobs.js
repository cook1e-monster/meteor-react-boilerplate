import { Meteor } from 'meteor/meteor'
import { _ } from 'meteor/underscore'
// import { logger } from '/imports/api/logger/server/logger.js'

export const QueueJobs = JobCollection('queue_jobs')

if (Meteor.isServer) {
  QueueJobs.allow({
    admin: function(userId, method, params) {
      return userId ? true : false
    }
  })
}

// TODO update clean idel jobs == jobsTypesToRemove ==
export function cleanIdleJobs() {
  var jobsTypesToRemove, jobsToRemoveIds, jobsToRestartIds

  // logger.debug('cleanIdleJobs: called')

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
    // logger.info('cleanIdleJobs: removing this jobs', {
    //   jobsToRemoveIds: jobsToRemoveIds
    // })
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
    // logger.info('cleanIdleJobs: restarting this jobs', {
    //   jobsToRestartIds: jobsToRestartIds
    // })
  }

  QueueJobs.cancelJobs(jobsToRestartIds)
  return QueueJobs.restartJobs(jobsToRestartIds)
}
