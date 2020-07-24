module.exports = {
    auth_cookie: 'x-access-token',
    service_name: 'MACROCHAT',
    mongo_url: 'mongodb://localhost:3010',
    db_name: 'macrohard',
    db_connection_timeout: 10000,
    secret: process.env.SECRET || 'MY SECRET PASSWORD'
}