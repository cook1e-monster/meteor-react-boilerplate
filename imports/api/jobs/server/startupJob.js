const h24 = 86400000,
  h12 = 43200000,
  h6 = 21600000,
  h1 = 3600000

export const jobs = [
  {
    type: 'autoStartJob',
    delay: h1,
    query: {}
  },
  {
    type: 'supervisorJobs',
    delay: h1,
    query: {}
  }
]
