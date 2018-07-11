import React from 'react'
import { allJobs } from '/imports/api/jobs/queries.js'
import moment from 'moment'
import TabularTable from '../tabularTable/TabularTable'
import { Segment, Label } from 'semantic-ui-react'
import { QueueJobs } from '/imports/api/jobs/jobs'

import { jobLabels } from './helpers'
import Buttons from './Buttons'

export default function TabularTableJobs() {
  return (
    <Segment>
      <TabularTable
        query={allJobs}
        fields={['log', 'data', 'retries', 'retried', 'repeats']}
        columns={[
          {
            title: 'Type',
            data: 'type'
          },
          {
            title: 'ID',
            data: '_id'
          },
          {
            title: 'Symbol',
            render: function(val, type, doc) {
              return doc.data.symbol
            }
          },
          {
            title: 'Run at',
            data: 'after',
            render: function(val, type, doc) {
              var output
              output = moment(val).fromNow()
              if (val > new Date()) {
                return <span className="text-danger">{output}</span>
              } else {
                return <span className="text-success">{output}</span>
              }
            }
          },
          {
            title: 'Updated',
            data: 'updated',
            render: function(val, type, doc) {
              return moment(val).fromNow()
            }
          },
          {
            title: 'Priority',
            data: 'priority'
          },
          {
            title: 'Dep',
            render: function(val, type, doc) {
              var numDepends, numResolved, ref, ref1
              numDepends = ((ref = doc.depends) != null ? ref.length : void 0) || 0
              numResolved = ((ref1 = doc.resolved) != null ? ref1.length : void 0) || 0
              return numDepends + ' / ' + numResolved
            }
          },
          {
            title: 'Attempts',
            data: 'retried',
            render: function(val, type, doc) {
              return 1
              // const numRetries = doc.retries === QueueJobs.Forever ? '∞' : doc.retries
              // return doc.retried + ' / ' + numRetries
            }
          },
          {
            title: 'Repeats',
            data: 'repeated',
            render: function(val, type, doc) {
              const numRepeats = doc.repeats === QueueJobs.Forever ? '∞' : doc.repeats
              return `${doc.repeated}/${numRepeats}`
            }
          },
          {
            title: 'Status',
            data: 'status',
            render: function(val, type, doc) {
              return <Label color={jobLabels(val)}>{val}</Label>
            }
          },
          {
            title: 'Actions',
            render: function(val, type, doc) {
              return <Buttons doc={doc} />
            }
          }
        ]}
      />
    </Segment>
  )
}
