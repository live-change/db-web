function createBackend(config) {
  if(config.backend == 'mem') {
    return {
      levelup: require('levelup'),
      memdown: require('memdown'),
      subleveldown: require('subleveldown'),
      encoding: require('encoding-down'),
      Store: require('@live-change/db-store-level'),
      createDb(path, options) {
        const db = this.levelup(this.memdown(options), options)
        db.path = path
        return db
      },
      closeDb(db) {
        db.close()
      },
      async deleteDb(db) {
        db.close()
        await rimraf(db.path)
      },
      createStore(db, name, options) {
        return new this.Store(this.subleveldown(db, name,
            { ...options, keyEncoding: 'ascii', valueEncoding: 'json' }))
      },
      closeStore(store) {
      },
      async deleteStore(store) {
        await store.clear()
      }
    }
  } else throw new Error("Unknown backend " + config.backend)
}

module.exports = createBackend
