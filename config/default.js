
if(process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

module.exports = {
  App: {
    port: process.env["PORT"] || 3000,

    database: {
      mongoUrl: `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@${process.env.MONGO_HOSTNAME}?directConnection=true&&replicaSet=replicaset&retryWrites=true`,
    },
    logger: {
      enabled: true,
      level: "info"
    },
    auth: {
      key: "O amanhecer do dia",
      tokenExpiresIn: '7 days'
    }
  }
}