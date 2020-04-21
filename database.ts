// Imports
import * as Mongo from "mongodb"
import { Int32 } from "mongodb"

// Instances
const client = new Mongo.MongoClient("mongodb://localhost:27017/")

var db: Mongo.Db

client.connect((err, dbc) => {
    if (err) throw err

    db = dbc.db('SDNEBot')
})

/** Returns user from Database */
export function getUser(id: String, callback: Function) {
    if (id === '') throw new Error('No ID Supplied')

    db.collection('users').find({ id: id }).toArray((err, res) => {
        if (err) throw err

        callback(res[0])
    })
}

export function updateUser(id: String, name?: String, warns?: Int32, kicks?: Int32, muted?: boolean) {

}