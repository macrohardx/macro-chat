import { Mongoose } from "mongoose"
import { Maybe } from './maybe';

export const maybeConnectToDatabase = (database: Mongoose, dbUrl: string, dbName: string, dbTimeout: number) : Promise<Maybe<any>> =>
    database.connect(`${dbUrl}/${dbName}`, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        connectTimeoutMS: dbTimeout,
        socketTimeoutMS: dbTimeout
    })
    .then(() => Promise.resolve({ result: true }))
    .catch(error => Promise.resolve({ error: error }))