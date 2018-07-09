module.exports = {
  servers: {
    one: {
      host: '34.228.9.183',
      username: 'ubuntu',
      pem: '/home/carlos/.ssh/carlos_aws.pem'
    }
  },

  meteor: {
    name: 'faucet',
    path: '/home/carlos/Desktop/Projects/faucet',
    port: 8073,
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
      ROOT_URL: 'https://cryptoforlove.com',
      MONGO_URL:
        'mongodb://cryptoForLove:3MvZxNYpZKuv@ds131633-a0.mlab.com:31633,ds131633-a1.mlab.com:31633/cryptoforlove?replicaSet=rs-ds131633',
      PORT: 8073,
      HTTP_FORWARDED_COUNT: 1
    },
    deployCheckWaitTime: 120 //default 10
  }
}
