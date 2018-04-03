const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// 封装mongodb
function mongodb() {

  // Connection URL
  const url = 'mongodb://localhost:27017';

  // Database Name
  const dbName = 'yygqxy';

  function createConnection(url, fn) {
    new Promise(function(resolve, reject){
      // Use connect method to connect to the server
      MongoClient.connect(url, function(err, client) {
        assert.equal(null, err);
        console.log("Connected successfully to server");

        const db = client.db(dbName);

        resolve(db);

        // client.close();
      });
    });
  }

  function collection(doc) {
    createConnection(url).then((db) => {
      return db.collection(doc)
    })
  }

  return {
    createConnection
  }
};

// db('song', insertMany([{a: 1, b: 2}], function(err, result) { ... })


module.exports = mongodb;