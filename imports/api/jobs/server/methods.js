import { Meteor } from 'meteor/meteor'
import { ValidatedMethod } from 'meteor/mdg:validated-method'
import { QueueJobs } from '/imports/api/jobs/jobs.js'
import SimpleSchema from 'simpl-schema'
import { _ } from 'meteor/underscore'
import { logger } from '../../logger/server/logger.js'

export const jobsPause = new ValidatedMethod({
  name: 'jobs.pauseJob',
  validate: new SimpleSchema({
    jobId: { type: String }
  }).validator(),
  run({ jobId }) {
    let user = Meteor.users.findOne({ _id: this.userId }, { fields: { roles: 1 } })
    if (!_.contains(user.roles, 'admin')) throw new Meteor.Error(500, 'Access Deny')

    QueueJobs.getJob(jobId, (error, job) => {
      job.pause((e, r) => {
        console.log(e, r)
      })
    })
  }
})

// ==================== old ======================================
Meteor.methods({
  clearCompletedJobs: function() {
    if (!isAdmin()) {
      throw new Meteor.Error(500, 'You dont have permision to execute clearCompletedJobs')
    }

    logger.debug('cleanCompletedJobs: called')

    const jobsToRemoveIds = _.pluck(
      QueueJobs.find({ status: 'completed' }, { _id: 1 }).fetch(),
      '_id'
    )

    return QueueJobs.removeJobs(jobsToRemoveIds)
  },

  cancelIdleJobs: function() {
    if (!isAdmin()) {
      throw new Meteor.Error(500, 'You dont have permision to execute cancelIdleJobs')
    }

    logger.debug('cancelIdleJobs: called')

    const thirty_mins_ago = new Date(
      moment()
        .subtract(30, 'minutes')
        .valueOf()
    )

    const jobsToCancel = QueueJobs.find(
      { status: 'running', updated: { $lt: thirty_mins_ago } },
      { _id: 1 }
    ).fetch()

    const jobsToCancelIds = _.pluck(jobsToCancel, '_id')

    if (jobsToCancelIds.length > 0) {
      logger.warn('cancelIdleJobs: found idle jobs to cancel', {
        numJobs: jobsToCancelIds.length
      })
    }

    return QueueJobs.cancelJobs(jobsToCancelIds)
  },

  removeCancelledJobs: function() {
    logger.debug('removeCancelledJobs: called')
    const jobsToRemoveIds = _.pluck(
      QueueJobs.find({ status: 'cancelled' }, { _id: 1 }).fetch(),
      '_id'
    )
    return QueueJobs.removeJobs(jobsToRemoveIds)
  }
})
