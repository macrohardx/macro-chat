import * as path from 'path'
import * as express from 'express'
import * as http from 'http'
import { maybeConnectToDatabase } from './utils/database-connection'
import config from './config'
import { initChatSocket } from './chat/chat-socket'
import * as mongoose from 'mongoose'
import { ChatRoomRouter } from './chat/room-routes/chat-room.router'
import * as cookieParser from 'cookie-parser'

const app = express()
const server = http.createServer(app)

export const startApp = async () => {

    let maybeMongoConnection = await maybeConnectToDatabase(mongoose, config.mongo_url, config.db_name, config.db_connection_timeout)
    if (!maybeMongoConnection.ok) {
        console.log(`Error connecting to database - ${maybeMongoConnection.error}`)
        return process.exit(2)
    }

    app.use(cookieParser())

    app.use('/macro-chat/api/v1/room', ChatRoomRouter())

    //app.all(/^\/macro-chat\/socket-connection$/, (req, res) => { res.redirect('/macro-chat/socket-connection/'); });
    // Starts Socket.IO endpoints (web sockets)
    //initChatSocket(server, '/macro-chat/socket-connection/')

    // // Chat API Endpoints (HTTP routes)
    // const chatRouter = require('./chat/chat-router')
    // app.use('/macro-chat/api', chatRouter(appLocalStorage))

    

    // serves angular static content

    // normalizes URL to always point to "/macro-chat/"
    app.all(/^\/macro-chat$/, (_req, res, _next) => res.redirect('/macro-chat/'));
    app.use('/macro-chat/', express.static(path.join(__dirname, '../../client/dist')))

    // Catches all other routes and return index.html (angular app starting point)
    app.get(/^\/macro-chat\/.*/, (_req, res) => res.sendFile(path.join(__dirname, '../../client/dist/index.html')))

    server.listen(4000, () => {console.log('listening to http://localhost:4000')})
}