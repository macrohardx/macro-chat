import * as cookie from 'cookie'
import * as jwt from 'jsonwebtoken'
import config from '../config'
import { IMaybe } from './maybe'

export const maybeGetUserDataFromJwtCookie = async (headerCookies, cookieName) : Promise<IMaybe<any>> => {
    if (!headerCookies)
        return Promise.resolve({ error: 'Invalid Cookie', ok: false })

    const cookies = cookie.parse(headerCookies)
    if (!cookies || !cookies[cookieName])
        return Promise.resolve({ error: 'Invalid Cookie Name', ok: false })

    return await decodeJwt(cookies[cookieName])
}

export const decodeJwt = (token) : Promise<IMaybe<any>> =>
    new Promise((resolve) => {
        jwt.verify(token, config.secret, (error, decoded) =>
            error ? resolve({ error, ok: false }) : resolve({ result: decoded, ok: true })
        )
    })