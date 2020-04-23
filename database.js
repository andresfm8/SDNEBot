"use strict";
exports.__esModule = true;
// Imports
var Mongo = require("mongodb");
var mongodb_1 = require("mongodb");
// Instances
var client = new Mongo.MongoClient("mongodb://localhost:27017/");
var db;
client.connect(function (err, dbc) {
    if (err)
        throw err;
    db = dbc.db('SDNEBot');
});
/** Returns user from Database */
function getUser(uid, callback) {
    db.collection('users').find({ uid: uid }).toArray(function (err, res) {
        if (err)
            throw err;
        callback(res[0]);
    });
}
exports.getUser = getUser;
function getRoles(callback) {
    db.collection('roles').find().toArray(function (err, res) {
        if (err)
            throw err;
        callback(res);
    });
}
exports.getRoles = getRoles;
function getConfig(key, callback) {
    db.collection('config').find({ key: key }).toArray(function (err, res) {
        if (err)
            throw err;
        callback(res[0]);
    });
}
exports.getConfig = getConfig;
/** Update or Insert a user in the Database */
function updateUser(uid, name, warns, kicks, muted, cbp, addTo) {
    getUser(uid, function (user) {
        var t = mongodb_1.Timestamp.fromNumber(Date.now());
        var userObj = {};
        userObj['uid'] = uid;
        userObj['name'] = name;
        userObj['lastUpdated'] = t;
        if (user != undefined) {
            // User Exists
            if (warns != undefined)
                userObj['warns'] = warns + (addTo ? user['warns'] : 0);
            if (kicks != undefined)
                userObj['kicks'] = kicks + (addTo ? user['kicks'] : 0);
            if (muted != undefined)
                userObj['muted'] = muted;
            if (cbp != undefined)
                userObj['cbp'] = cbp + (addTo ? user['cbp'] : 0);
            db.collection('users').updateOne({ uid: uid }, { $set: userObj }, function (err, res) {
                if (err)
                    throw err;
            });
        }
        else {
            // User doesn't exist
            userObj['warns'] = (warns != undefined ? warns : 0);
            userObj['kicks'] = (kicks != undefined ? kicks : 0);
            userObj['muted'] = (muted != undefined ? muted : false);
            userObj['cbp'] = (cbp != undefined ? cbp : 0);
            db.collection('users').insertOne(userObj, function (err, res) {
                if (err)
                    throw err;
            });
        }
    });
}
exports.updateUser = updateUser;
/** Update Bot Config Settings */
function updateConfig(key, value) {
    var obj = {
        key: key,
        value: value
    };
    db.collection('config').find({ key: key }).toArray(function (err, res) {
        if (err)
            throw err;
        if (res != undefined) {
            // Config Exists
            db.collection('config').updateOne({ key: key }, { $set: obj }, function (err, res) {
                if (err)
                    throw err;
            });
        }
        else {
            // Config doesn't exist
            db.collection('config').insertOne(obj, function (err, res) {
                if (err)
                    throw err;
            });
        }
    });
}
exports.updateConfig = updateConfig;
