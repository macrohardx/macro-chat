import * as path from 'path'
import * as express from 'express'
import * as http from 'http'
import { maybeConnectToDatabase } from './utils/database-connection'
import config from './config'
import { initChatSocket } from './chat/chat-socket'
import * as mongoose from 'mongoose'

const app = express()
const server = http.createServer(app)

export const startApp = async () => {

    let maybeMongoConnection = await maybeConnectToDatabase(mongoose, config.mongo_url, config.db_name, config.db_connection_timeout)
    if (!maybeMongoConnection.ok) {
        console.log(`Error connecting to database - ${maybeMongoConnection.error}`)
        return process.exit(2)
    }

    app.all(/^\/macro-chat\/socket-connection$/, (req, res) => { res.redirect('/macro-chat/socket-connection/'); });
    // Starts Socket.IO endpoints (web sockets)
    initChatSocket(server, '/macro-chat/socket-connection/')

    // // Chat API Endpoints (HTTP routes)
    // const chatRouter = require('./chat/chat-router')
    // app.use('/macro-chat/api', chatRouter(appLocalStorage))

    // static content
    app.all(/^\/macro-chat$/, (req, res) => { res.redirect('/macro-chat/'); });
    app.use('/macro-chat/', (req, res, next) => {        
        return express.static(path.join(__dirname, '../../client/dist'))(req, res, next);
    })

    server.listen(4000, () => {console.log('listening to http://localhost:4000')})
}