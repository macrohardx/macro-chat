import { Mongoose } from "mongoose"

export const maybeConnectToDatabase = (database: Mongoose, dbUrl: string, dbName: string, dbTimeout: number) =>
    database.connect(`${dbUrl}/${dbName}`, {
        useNewUrlParser: true,
        useCreateIndex: true,
        connectTimeoutMS: dbTimeout,
        socketTimeoutMS: dbTimeout
    })
    .then(() => Promise.resolve({ ok: true }))
    .catch(error => Promise.resolve({ ok: false, error: new Error(error) }))  