var MongoClient = require("mongodb").MongoClient;
var mongo = require("mongodb");
var events = require('events');
require("dotenv").config();

var dbName = process.env.DBS_NAME;
var db;
/**
 * @param mongodb object
 */
var mongoClient;
var eventEmitter = new events.EventEmitter();

/**
 * @param {string} url - connection string
 * return a Promise
 */

function connect(url) {
    return new Promise((resolve, reject) => {
        MongoClient.connect(url)
            .then(
                mongoClient => {
                    db = mongoClient.db(dbName);
                    eventEmitter.emit('dbInstanceChanged', db);
                    console.log('emit db changed event done.');
                    resolve(db);
                }
            ).catch(err => {
                let error = 'Connect to DB failed: ' + err;
                reject(new Error(error));
            })
    })
}

/**
 * @function disconnect(){
 * }
 */

function disconnect() {
    if (mongoClient) {
        mongoClient.close();
    }
    db = undefined;
    mongoClient = undefined;
    eventEmitter.emit('dbInstanceChanged', db);
}

module.exports = {
    connect,
    disconnect,
    eventEmitter
}