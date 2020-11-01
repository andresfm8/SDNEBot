/**
 *
 * N3rdP1um23
 * October 31, 2020
 * The following file is used to interface with the database
 *
 */

// Import the requried files
import { getConnection, getRepository } from 'typeorm';
import { Config } from './lib/Entities/Config';
import { User } from './lib/Entities/User';
import * as moment from 'moment';

// The following function is used to return a selected user
export async function getUser(uid: string, name: string, callback: Function) {
    // Query and store the user find in a variable
    var user = await getConnection().getRepository(User).createQueryBuilder('user').where('user.uid = :uid', { uid: uid }).getOne();

    // Check to see if the user was found
    if(user !== undefined) {
        // Execute the callback function
        callback(user);
    }else{
        // Create the user object
        let userData = {
            uid: uid,
            name: name,
            lastUpdated: moment().unix().toString(),
            warns: 0,
            kicks: 0,
            muted: false,
            cbp: 0,
        };

        // Insert the new user into the database
        await getConnection().getRepository(User).createQueryBuilder().insert().into(User).values(userData).execute();

        // Execute the callback function
        callback(userData);
    }
}

// The following function is used to return a set of roles
export function getRoles(callback: Function) {
    // Return the config value
    return []; // await getConnection().getRepository(Config).createQueryBuilder('config').where('config.key = :key', { key: key }).getOne();
}

// The following function is used to take in a key and then return the respective config value
export async function getConfig(key: string) {
    // Query and grab the respective config key
    var config_key = await getConnection().getRepository(Config).createQueryBuilder('config').where('config.key = :key', { key: key }).getOne();

    // Check to see if the config key is found
    if(config_key !== undefined) {
        // Return the respective config key
        return config_key.value;
    }

    // Return the config value
    return
}

/** Update or Insert a user in the Database */
export function updateUser(uid: string, name: string, warns?: number, kicks?: number, muted?: boolean, cbp?: number, addTo?: boolean | false) {
    // Grab the respective user from the database
    getUser(uid, name, async (user: Object) => {
        // Create the required variables
        let t: string = moment().unix().toString();
        let userObj = {};

        // Start processing the update for the user items
        userObj['uid'] = uid;
        userObj['name'] = name;
        userObj['lastUpdated'] = t;

        // Check to see if the user exists
        if(user !== undefined) {
            // Check to see if there are any warns for the user
            if(warns !== undefined) {
                // Update the users warns count
                userObj['warns'] = warns + ((addTo) ? user['warns'] : 0);
            }

            // Check to see if there are any kicks for the user
            if(kicks !== undefined) {
                // Update the users warns count
                userObj['kicks'] = kicks + ((addTo) ? user['kicks'] : 0);
            }

            // Check to see if the user is muted
            if(muted !== undefined) {
                // Update the users warns count
                userObj['muted'] = muted;
            }

            // Check to see if there are any contribution points for the user
            if(cbp !== undefined) {
                // Update the users contribution points count
                userObj['cbp'] = cbp + ((addTo) ? user['cbp'] : 0);
            }

            // Update the user
            await getConnection().getRepository(User).createQueryBuilder().update(User).set(userObj).where('uid = :uid', { uid: uid }).execute();
        }else{
            // Update the users parameters for a first time entry
            userObj['warns'] = ((warns !== undefined) ? warns : 0);
            userObj['kicks'] = ((kicks !== undefined) ? kicks : 0);
            userObj['muted'] = ((muted !== undefined) ? muted : false);
            userObj['cbp'] = ((cbp !== undefined) ? cbp : 0);

            // Insert the user
            await getConnection().getRepository(User).createQueryBuilder().insert().into(User).values(userObj).execute();
        }
    })
}

/** Update Bot Config Settings */
export async function updateConfig(key: string, value: string) {
    // Check to see if the config key doesn't exist already
    if(getConfig(key) === undefined) {
        // Create the new key and store it into the database
        await getConnection().getRepository(Config).createQueryBuilder().insert().into(Config).values({ key: key, value: value }).execute();

        // Return the stop further processing
        return;
    }

    // Update the respective config item value based on the passed in key
    await getConnection().getRepository(Config).createQueryBuilder().update(Config).set({ value: value }).where('key = :key', { key: key }).execute();
}