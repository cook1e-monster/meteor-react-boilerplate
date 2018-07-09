module.exports = {
  servers: {
    one: {
      host: '34.228.9.183',
      username: 'ubuntu',
      pem: '/home/carlos/.ssh/carlos_aws.pem'
    }
  },

  meteor: {
    name: 'faucet_testing',
    path: '/home/carlos/Desktop/Projects/faucet',
    port: 8072,
    dockerImage: 'abernix/meteord:node-8.4.0-binbuild',
    buildOptions: {
      serverOnly: true,
      debug: false,
      cleanAfterBuild: true // default
    },
    servers: {
      one: {}
    },
    env: {
      PORT: 8071,
      ROOT_URL: 'https://test.cryptoforlove.com/',
      MONGO_URL: 'mongodb://faucet:faucet@ds123929.mlab.com:23929/faucet',
      CLUSTER_WORKERS_COUNT: 'auto',
      PORT: 8072,
      HTTP_FORWARDED_COUNT: 1
    },
    deployCheckWaitTime: 120 //default 10
  }
}
