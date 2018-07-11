import { Meteor } from 'meteor/meteor'
import { QueueJobs } from '../jobs.js'
import { allJobs } from '../queries'

QueueJobs.expose({
  firewall(userId, params) {
    if (!Roles.userIsInRole(userId, 'ADMIN')) {
      throw new Meteor.Error('not-allowed')
    }
  },
  body: {
    _id: 1,
    data: 1,
    updated: 1,
    priority: 1,
    depends: 1,
    retried: 1,
    repeated: 1,
    status: 1
  },
  // Allow reactive query-ing
  publication: true,
  // Allow static query-in
  method: true,
  // Unblock() the method/publication
  blocking: false,
  // The publication/method will not allow data fetching for more than 100 items.
  maxLimit: 100,
  // The publication/method will not allow a query with more than 3 levels deep.
  maxDepth: 2
  // This will clean up filters, options.sort and options.fields and remove those fields from there.
  // It even removes it from deep filters with $or, $nin, etc
})

allJobs.expose({
  publication: true
  // unblock: true,
  // method: true
})
