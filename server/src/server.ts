import { createLogger } from './utils/logger'
import config from './config'

let logger1 = createLogger('error')
let logger2 = createLogger('debug')

console.log(config.auth_cookie)

//require('./app').startApp()