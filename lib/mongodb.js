const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// 封装mongodb
function mongodb() {

  // Connection URL
  const url = 'mongodb://localhost:27017';

  // Database Name
  const dbName = 'yygqxy';

  let db;

  function createConnection(url) {
    // Use connect method to connect to the server
    MongoClient.connect(url, function(err, client) {
      assert.equal(null, err);
      console.log("Connected successfully to server");

      db = client.db(dbName);

      // client.close();
    });
  }

  function collection(doc) {
    return db.collection(doc)
  }

  return {
    createConnection,
    collection
  }
};



module.exports = mongodb;