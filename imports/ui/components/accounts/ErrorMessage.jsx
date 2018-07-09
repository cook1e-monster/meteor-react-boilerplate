import React from 'react'
import { Message } from 'semantic-ui-react'

export default function ErrorMessage(props) {
  const { code, message } = props

  return (
    <Message style={{ textAlign: 'left' }} negative>
      <Message.Header>Error {code}</Message.Header>
      <p>{message}</p>
    </Message>
  )
}
