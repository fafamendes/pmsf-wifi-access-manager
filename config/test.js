if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
console.log(process.env.MONGO_INITDB_ROOT_USERNAME);

module.exports = {
  App: {

    logger: {
      enabled: false
    },
    database: {
      mongoUrl: `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@${process.env.MONGO_HOSTNAME}?directConnection=true&&replicaSet=replicaset&retryWrites=true`,
    },
  }
}