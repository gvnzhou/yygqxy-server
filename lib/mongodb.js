const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const Config = require('../config');

function mongodb() {
  let db;

  function createConnection(url) {
    // Use connect method to connect to the server
    MongoClient.connect(url, function(err, client) {
      assert.equal(null, err);
      console.log("Connected successfully to MongoDB");

      db = client.db(Config.MongoDB.dbName);

      // client.close();
    });
  }

  function collection(doc) {
    return db.collection(doc)
  }

  return {
    createConnection: createConnection,
    c: collection
  }
};

module.exports = mongodb();