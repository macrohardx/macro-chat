const maybeConnectToDatabase = (database, dbUrl, dbName, dbTimeout) =>
    database.connect(`${dbUrl}/${dbName}`, {
        useNewUrlParser: true,
        //useUnifiedTopology: true, // Timeout doesn't work with this option on
        useCreateIndex: true,
        connectTimeoutMS: dbTimeout,
        socketTimeoutMS: dbTimeout
    })
    .then(value => Promise.resolve({ ok: true, value }))
    .catch(error => Promise.resolve({ ok: false, error: new Error(error) }))

module.exports = {
    maybeConnectToDatabase
}    