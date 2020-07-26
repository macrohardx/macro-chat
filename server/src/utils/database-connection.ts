import { Mongoose } from "mongoose"
import { IMaybe } from './maybe';

export const maybeConnectToDatabase = (database: Mongoose, dbUrl: string, dbName: string, dbTimeout: number) : Promise<IMaybe<any>> =>
    database.connect(`${dbUrl}/${dbName}`, {
        useNewUrlParser: true,
        useCreateIndex: true,
        connectTimeoutMS: dbTimeout,
        socketTimeoutMS: dbTimeout
    })
    .then(() => Promise.resolve({ ok: true }))
    .catch(error => Promise.resolve({ ok: false, error: error }))