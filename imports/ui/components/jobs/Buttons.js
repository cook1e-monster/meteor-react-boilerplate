import React from 'react'
import moment from 'moment'
import { Button, Modal, Table, Header, Icon } from 'semantic-ui-react'
import { QueueJobs } from '/imports/api/jobs/jobs.js'

const remove = jobId => (
    <Button
        size="mini"
        color="red"
        onClick={() => {
            QueueJobs.getJob(jobId, function(error, job) {
                if (!error && job) job.remove()
            })
        }}
    >
        <Icon name="remove" />
    </Button>
)

const repeat = jobId => (
    <Button
        size="mini"
        color="blue"
        onClick={() => {
            QueueJobs.getJob(jobId, function(error, job) {
                if (!error && job) job.restart()
            })
        }}
    >
        <Icon name="repeat" />
    </Button>
)

const paused = jobId => (
    <Button
        size="mini"
        onClick={() => {
            QueueJobs.getJob(jobId, function(error, job) {
                if (!error && job) job.pause()
            })
        }}
    >
        <Icon name="pause" />
    </Button>
)

const resume = jobId => (
    <Button
        size="mini"
        onClick={() => {
            QueueJobs.getJob(jobId, function(error, job) {
                if (!error && job) job.resume()
            })
        }}
    >
        <Icon name="play" />
    </Button>
)

const cancelled = jobId => (
    <Button
        size="mini"
        color="yellow"
        onClick={() => {
            QueueJobs.getJob(jobId, function(error, job) {
                if (!error && job) job.cancel()
            })
        }}
    >
        <Icon name="stop" />
    </Button>
)

const Buttons = props => {
    const { doc } = props

    return (
        <Button.Group>
            <Modal
                trigger={
                    <Button size="mini">
                        <Icon name="info" />
                    </Button>
                }
                size="large"
                style={{ maxHeight: '75%', overflowY: 'visible' }}
            >
                <Modal.Content scrolling>
                    <Header>Job info: {doc._id}</Header>
                    <p>{JSON.stringify(doc.data, null, 4)}</p>
                    <Table celled>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Time</Table.HeaderCell>
                                <Table.HeaderCell>Since</Table.HeaderCell>
                                <Table.HeaderCell>RunId</Table.HeaderCell>
                                <Table.HeaderCell>Level</Table.HeaderCell>
                                <Table.HeaderCell>Message</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {doc.log &&
                                doc.log.map((log, key) => {
                                    let style = `label label-${log.level}`

                                    return (
                                        <Table.Row key={key}>
                                            <Table.Cell>
                                                {moment(new Date(log.time)).format(
                                                    'H:mm:ss DD/MM/YY'
                                                )}
                                            </Table.Cell>
                                            <Table.Cell>{moment(log.time).fromNow()}</Table.Cell>
                                            <Table.Cell>{log.runId}</Table.Cell>
                                            <Table.Cell>
                                                <span className={style}>{log.level}</span>
                                            </Table.Cell>
                                            <Table.Cell>{log.message}</Table.Cell>
                                        </Table.Row>
                                    )
                                })}
                        </Table.Body>
                    </Table>
                </Modal.Content>
            </Modal>

            {doc.status === 'cancelled' || doc.status === 'failed' ? repeat(doc._id) : null}
            {doc.status === 'cancelled' || doc.status === 'failed' ? remove(doc._id) : null}
            {doc.status === 'paused' ? resume(doc._id) : null}
            {doc.status === 'waiting' || doc.status === 'running' || doc.status === 'ready'
                ? paused(doc._id)
                : null}
            {doc.status === 'paused' ||
            doc.status === 'waiting' ||
            doc.status === 'running' ||
            doc.status === 'ready'
                ? cancelled(doc._id)
                : null}
        </Button.Group>
    )
}

export default Buttons
