import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import { logger } from '/imports/api/logger/server/logger.js'

export function addDefaultAccounts() {
  const accounts = Meteor.settings.defaultAccounts || []

  accounts.forEach(function(account) {
    if (!Accounts.users.findOne({ 'emails.address': account.email })) {
      const accountId = Accounts.createUser(account)

      if (account.roles.length) {
        Roles.addUsersToRoles(accountId, account.roles, Roles.GLOBAL_GROUP)
      }
    }
  })
}
