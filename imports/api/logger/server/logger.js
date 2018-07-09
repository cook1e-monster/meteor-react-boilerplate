import { Meteor } from 'meteor/meteor'

import { Papertrail } from 'winston-papertrail'
import winston from 'winston'
import moment from 'moment'

const transports = []
if (Meteor.isDevelopment) {
  const consoleLogger = new winston.transports.Console({
    level: 'debug',
    colorize: true,
    timestamp() {
      return moment().format('DD/MM/YY(HH:mm:ss)')
    }
  })
  transports.push(consoleLogger)
} else {
  const paperTrailLoggerConfig = Meteor.settings.config
  paperTrailLoggerConfig.timestamp = () => moment().format('DD/MM/YY(HH:mm:ss)')

  const consoleLogger = new winston.transports.Console({
    level: 'info',
    colorize: true,
    timestamp() {
      return moment().format('DD/MM/YY(HH:mm:ss)')
    }
  })

  transports.push(consoleLogger)

  const paperTrailLogger = new Papertrail(paperTrailLoggerConfig)
  transports.push(paperTrailLogger)

  paperTrailLogger.on('error', error =>
    console.log({
      error
    })
  )
}

exports.logger = new winston.Logger({ transports })
