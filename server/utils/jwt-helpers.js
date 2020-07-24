const cookie = require('cookie')
const jwt = require('jsonwebtoken')
const config = require('../config')

module.exports = {

    maybeGetUserDataFromJwtCookie: async (headerCookies, cookieName) => {
        if (!cookie)
            return Promise.resolve({ error: 'Invalid Cookie' })

        const cookies = cookie.parse(headerCookies)
        if (!cookies || cookies[cookieName])
            return Promise.resolve({ error: 'Invalid Cookie Name' })

        return await decodeJwt(cookies[cookieName])
    },

    decodeJwt: (token) => {
        return new Promise((resolve) => {
            jwt.verify(token, config.secret, (err, decoded) =>
                err ? resolve({ error: err }) : resolve({ decoded })
            )
        })
    }
}