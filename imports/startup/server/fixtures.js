// Fill the DB with example data on startup

import { Meteor } from 'meteor/meteor'
import { addDefaultAccounts } from './utils/defaultAccounts'

Meteor.startup(() => {
  addDefaultAccounts()
})
