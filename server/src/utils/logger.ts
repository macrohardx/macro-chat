import { logger } from "handlebars"
import { TIMEOUT } from "dns"

let cacheLogger = null

class Logger {
    private logLevel: string

    constructor(logLevel: string) {
        this.logLevel = logLevel
    }

    logError(error) {
        setTimeout(() => {
            this.log(error)
        }, 0)
    }

    private log(msg: any) {
        console.log(msg)
    }
}
export const createLogger = (logLevel: string) : Logger => (cacheLogger = (cacheLogger || new Logger(logLevel)))