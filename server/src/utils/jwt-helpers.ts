import * as cookie from 'cookie'
import * as jwt from 'jsonwebtoken'
import config from '../config'
import { IMaybe } from './maybe'

export const maybeGetUserDataFromJwtCookie = async (headerCookies: string, cookieName: string): Promise<IMaybe<any>> => {
    try {
        if (!headerCookies)
            return Promise.resolve({ error: 'Invalid Cookie', ok: false })

        const cookies = cookie.parse(headerCookies)
        if (!cookies || !cookies[cookieName])
            return Promise.resolve({ error: 'Invalid Cookie Name', ok: false })

        return await decodeJwt(cookies[cookieName])
    } catch (error) {
        return Promise.resolve({ ok: false, error})
    }
}

export const decodeJwt = (token: string): Promise<IMaybe<any>> =>
    new Promise((resolve) => {
        jwt.verify(token, config.secret, (error, decoded) =>
            error ? resolve({ error, ok: false }) : resolve({ result: decoded, ok: true })
        )
    })

export const authenticationMiddleware = async (req, res, next) => {
    let cookie = req.cookies[config.auth_cookie]
    if (!cookie) {
        return res.send({ error: 'Invalid authentication token' })
    }
    jwt.verify(cookie, config.secret, (error, decoded) => {
        if (error) {
            return res.send({ error: 'Invalid authentication token' })
        }
        req.user = decoded
        next()
    })
}    