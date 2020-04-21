"use strict";
exports.__esModule = true;
// Imports
var Mongo = require("mongodb");
// Instances
var client = new Mongo.MongoClient("mongodb://localhost:27017/");
var db;
client.connect(function (err, dbc) {
    if (err)
        throw err;
    db = dbc.db('SDNEBot');
});
/** Returns user from Database */
function getUser(id, callback) {
    if (id === '')
        throw new Error('No ID Supplied');
    db.collection('users').find({ id: id }).toArray(function (err, res) {
        if (err)
            throw err;
        callback(res[0]);
    });
}
exports.getUser = getUser;
