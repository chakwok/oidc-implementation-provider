const MongoClient = require('mongodb').MongoClient;

class MongodbHelper {
  constructor(dbPath) {
    this.dbPath = dbPath;
  }

  async getDb(dbName) {
    return await this._getConnection().db(dbName);
  }

  async _getConnection() {
    if(this.connection) {
      return this.connection;
    } else {
      return await this._connect();
    }
  }

  async _connect() {
    this.connection = await MongoClient.connect(this.dbPath,
      {useNewUrlParser: true});
    if(!this.connection) {
      throw Error(`DB ${this.dbPath} cannot be reached)`);
    }
    return this.connection;
  }
}

module.exports=MongodbHelper;