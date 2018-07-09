import React from 'react'
import { Loader, Dimmer } from 'semantic-ui-react'

export const Loading = props => {
  if (props.error) {
    return (
      <div>
        Error! <button onClick={props.retry}>Retry</button>
      </div>
    )
  } else if (props.pastDelay) {
    return (
      <Dimmer active={true}>
        <Loader size="huge">Loading</Loader>
      </Dimmer>
    )
  }

  return null
}
