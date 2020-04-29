// Imports
import * as Mongo from "mongodb"
import { Int32, Long, Timestamp, Db } from "mongodb"
import { dbPass } from "./env"

// Instances
const client = new Mongo.MongoClient(`mongodb://dbUser:${dbPass}@sdnebot-shard-00-00-sh7xu.gcp.mongodb.net:27017,sdnebot-shard-00-01-sh7xu.gcp.mongodb.net:27017,sdnebot-shard-00-02-sh7xu.gcp.mongodb.net:27017/test?ssl=true&replicaSet=SDNEBot-shard-0&authSource=admin&retryWrites=true&w=majority`, { useUnifiedTopology: true, useNewUrlParser: true })

var db: Db

client.connect((err, dbc) => {
    if (err) throw err

    db = dbc.db('SDNEBot')
})

/** Returns user from Database */
export function getUser(uid: string, name: string, callback: Function) {
    db.collection('users').find({ uid: uid }).toArray((err, res) => {
        if (err) throw err

        if (res[0] !== undefined)
            callback(res[0])
        else {
            let userData = {}
            userData['uid'] = uid
            userData['name'] = name
            userData['lastUpdated'] = Timestamp.fromNumber(Date.now())
            userData['warns'] = 0
            userData['kicks'] = 0
            userData['muted'] = false
            userData['cbp'] = 0
            db.collection('users').insertOne(userData, (err, res) => {
                if (err) throw err
            })
            callback(userData)
        }
    })
}

export function getRoles(callback: Function) {
    db.collection('roles').find().toArray((err, res: Array<Object>) => {
        if (err) throw err
        callback(res)
    })
}

export async function getConfig(key: string): Promise<string> {
    var promise: Promise<string> = new Promise((resolve, reject) => {
        db.collection('config').find({ key: key }).toArray((err, res) => {
            if (err) reject(err)

            if (res[0] !== undefined)
                resolve(res[0]['value'])
            else
                reject(new Error('Key not found'))
        })
    })

    return promise
}

/** Update or Insert a user in the Database */
export function updateUser(uid: string, name: string, warns?: Int32, kicks?: Int32, muted?: boolean, cbp?: Int32, addTo?: boolean | false) {
    getUser(uid, name, (user: Object) => {
        let t: Timestamp = Timestamp.fromNumber(Date.now())
        let userObj = {}

        userObj['uid'] = uid
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

            db.collection('users').updateOne({ uid: uid }, { $set: userObj }, (err, res) => {
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

/** Update Bot Config Settings */
export function updateConfig(key: string, value: string) {
    let obj = {
        key: key,
        value: value
    }

    db.collection('config').find({ key: key }).toArray((err, res) => {
        if (err) throw err

        if (res[0] !== undefined) {
            // Config Exists
            db.collection('config').updateOne({ key: key }, { $set: obj }, (err, res) => {
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