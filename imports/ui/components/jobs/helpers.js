export function jobLabels(status) {
  switch (status) {
    case 'cancelled':
      return 'yellow'
    case 'running':
      return 'green'
    case 'ready':
      return 'blue'
    case 'waiting':
      return 'grey'
    case 'failed':
      return 'red'
    default:
      return 'teal'
  }
}
