import { QueueJobs } from './jobs'
import { _ } from 'meteor/underscore'

export const allJobs = QueueJobs.createQuery('allJobs', {
  $filter({ filters, options, params }) {
    _.map(params.query, function(val, key) {
      filters[key] = val
    })
  },
  $paginate: true,
  type: 1,
  _id: 1,
  data: 1,
  updated: 1,
  priority: 1,
  depends: 1,
  retried: 1,
  repeated: 1,
  status: 1
})
