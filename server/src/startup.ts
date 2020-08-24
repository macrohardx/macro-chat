import * as path from 'path'
import * as express from 'express'
import { maybeConnectToDatabase } from './utils/database-connection'
import config from './config'
import * as mongoose from 'mongoose'
import * as cookieParser from 'cookie-parser'
import { Container } from 'inversify';
import { registerIocBind } from './config/ioc';
import { InversifyExpressServer } from 'inversify-express-utils'
import * as bodyParser from 'body-parser';

// Register all Application Controllers
import './config/register-controllers'

export const startup = async () => {

    const maybeMongoConnection = await maybeConnectToDatabase(mongoose, config.mongo_url, config.db_name, config.db_connection_timeout)
    if (!maybeMongoConnection.ok) {
        console.log(`Error connecting to database - ${maybeMongoConnection.error}`)
        return process.exit(2)
    }

    //Register IOC
    const iocContainer = new Container()
    registerIocBind(iocContainer)

    // Create express server with Dependency Injection
    const server = new InversifyExpressServer(iocContainer)
    server.setConfig((app) => {
        app.use(bodyParser.urlencoded({ extended: true }))
        app.use(bodyParser.json({ limit: '2mb' }))
        app.use(cookieParser())

        // normalizes URL to always point to "/macro-chat/"
        app.all(/^\/macro-chat$/, (_req, res, _next) => res.redirect('/macro-chat/'));
        app.use('/macro-chat/', express.static(path.join(__dirname, '../../client/dist')))

        // Catches all other routes and return index.html (angular app starting point)
        app.get(/^\/macro-chat\/.*/, (_req, res) => res.sendFile(path.join(__dirname, '../../client/dist/index.html')))

    })
    const app = server.build()
    app.listen(config.PORT, () => {
        console.log(`listening to port ${config.PORT}`)
    })




}