import * as path from 'path'
import * as express from 'express'
import * as http from 'http'
import { maybeConnectToDatabase } from './utils/database-connection'
import * as config from './config'
import { initChatSocket } from './chat/chat-socket'
import * as Handlebars from 'handlebars'
import * as fs from 'fs'

const app = express()
const server = http.createServer(app)

export const startApp = async () => {

    // let { dbOk, dbError } = await maybeConnectToDatabase(mongoose, config.mongo_url, config.db_name, config.db_connection_timeout)
    // if (!dbOk) {
    //     log(`Error connecting to database - ${dbError}`)
    //     return process.exit(2)
    // }

    //app.all(/^\/macro-chat\/socket-connection$/, function(req, res) { res.redirect('/macro-chat/socket-connection/'); });
    // // Starts Socket.IO endpoints (web sockets)
    initChatSocket(server, '/macro-chat/socket-connection/')

    // // Chat API Endpoints (HTTP routes)
    // const chatRouter = require('./chat/chat-router')
    // app.use('/macro-chat/api', chatRouter(appLocalStorage))

    // Templating to replace gateway IP
    // TODO Move to another file
    // let template
    // app.use('/', (req, res, next) => {
    //     if (req.originalUrl !== '/') return next();
    //     if (!template)
    //         template = Handlebars.compile(fs.readFileSync(path.join(__dirname, 'public', 'dist', 'index.html'), { encoding: 'utf-8' }))
    //     res.type('text/html').send(template({ gateway_ip: req.headers['x-gateway'] }))    
    // })

    // static content
    app.use('/app/', (req, res, next) => {
        
        return express.static(path.join(__dirname, '../../client/dist'))(req, res, next);
    })

    server.listen(4000, () => {console.log('listening to http://localhost:4000')})
}