// Imports
import * as Mongo from "mongodb"
import { Int32, Timestamp, Db } from "mongodb"

// Instances
const client = new Mongo.MongoClient("mongodb://localhost:27017/")

var db: Db

client.connect((err, dbc) => {
    if (err) throw err

    db = dbc.db('SDNEBot')
})

/** Returns user from Database */
export function getUser(uid: string, callback: Function) {
    db.collection('users').find({ _id: Number.parseInt(uid) }).toArray((err, res) => {
        if (err) throw err

        callback(res[0])
    })
}

/** Update or Insert a user in the Database */
export function updateUser(uid: string, name: String, warns?: Int32, kicks?: Int32, muted?: boolean, cbp?: Int32, addTo?: boolean | false) {
    getUser(uid, (user: JSON) => {
        let t: Timestamp = Timestamp.fromNumber(Date.now())
        let userObj = {}

        userObj['_id'] = Number.parseInt(uid)
        userObj['name'] = name
        userObj['lastUpdated'] = t

        if (user != undefined) {
            // User Exists

            if (warns != undefined)
                userObj['warns'] = warns + (addTo ? user['warns'] : 0)

            if (kicks != undefined)
                userObj['kicks'] = kicks + (addTo ? user['kicks'] : 0)

            if (muted != undefined)
                userObj['muted'] = muted

            if (cbp != undefined)
                userObj['cbp'] = cbp + (addTo ? user['cbp'] : 0)

            db.collection('users').updateOne({ _id: Number.parseInt(uid) }, { $set: userObj }, (err, res) => {
                if (err) throw err
            })
        } else {
            // User doesn't exist

            userObj['warns'] = (warns != undefined ? warns : 0)
            userObj['kicks'] = (kicks != undefined ? kicks : 0)
            userObj['muted'] = (muted != undefined ? muted : false)
            userObj['cbp'] = (cbp != undefined ? cbp : 0)

            db.collection('users').insertOne(userObj, (err, res) => {
                if (err) throw err
            })
        }
    })
}

export function updateConfig(id: number, key: string, value: string) {
    let obj = {
        _id: id,
        key: key,
        value: value
    }

    db.collection('config').find({ _id: id }).toArray((err, res) => {
        if (err) throw err

        if (res != undefined) {
            // Config Exists
            db.collection('config').updateOne({ _id: id }, { $set: obj }, (err, res) => {
                if (err) throw err
            })
        } else {
            // Config doesn't exist
            db.collection('config').insertOne(obj, (err, res) => {
                if (err) throw err
            })
        }
    })
}