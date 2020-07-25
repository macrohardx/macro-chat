import cookie from 'cookie'
import jwt from 'jsonwebtoken'
import config from '../config'
import { IMaybe } from './maybe'


export const decodeJwt = (token) : Promise<IMaybe> =>
    new Promise((resolve) => {
        jwt.verify(token, config.secret, (error, decoded) =>
            error ? resolve({ error, ok: false }) : resolve({ result: decoded, ok: true })
        )
    })

export const maybeGetUserDataFromJwtCookie = async (headerCookies, cookieName) : Promise<IMaybe> => {
    if (!cookie)
        return Promise.resolve({ error: 'Invalid Cookie', ok: false })

    const cookies = cookie.parse(headerCookies)
    if (!cookies || cookies[cookieName])
        return Promise.resolve({ error: 'Invalid Cookie Name', ok: false })

    return await decodeJwt(cookies[cookieName])
}