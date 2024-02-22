
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
      key: "rola_fritona_no_azeite_de_dendê_disgraça",
      tokenExpiresIn: '7 days'
    }
  }
}