const config = {
    PORT: 4000,
    auth_cookie: 'x-access-token',
    service_name: 'MACROCHAT',
    file_server_url: 'D:\\databases\\file-server\\macro-hard',
    username_cookie: 'x-username',
    user_id_cookie: 'x-user-id',
    mongo_url: 'mongodb://localhost:3010',
    db_name: 'macrohard',
    db_connection_timeout: 10000,
    secret: (process.env.SECRET as string) || 'MY SECRET PASSWORD',
    logLevel: (process.env.LogLevel as string || '').trim() || 'error'
}

export default config