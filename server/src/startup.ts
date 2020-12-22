import { maybeConnectToDatabase } from './utils/database-connection'
import config from './config'
import * as mongoose from 'mongoose'
import { registerIoc } from './config/ioc';
import { setupApi } from './config/setup-api';
import { setupSocket } from './config/setup-socket';
import { log } from './utils/logger';

// Register all Application Controllers
import './config/register-controllers'

export const startup = async () => {

    const maybeMongoConnection = await maybeConnectToDatabase(mongoose, config.mongo_url, config.db_name, config.db_connection_timeout)
    if (!maybeMongoConnection.result) {
        log(`Error connecting to database - ${maybeMongoConnection.error}`)
        return process.exit(2)
    }

    const iocContainer = registerIoc();   

    const expressApp = setupApi(iocContainer);
    
    const httpServer = expressApp.listen(config.PORT, () => console.log(`listening to port ${config.PORT}`));

    const ioServer = setupSocket(httpServer, iocContainer);
}