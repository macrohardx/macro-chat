const express    = require('express')
const router     = express.Router()
const bodyParser = require('body-parser')
const Message    = require('./model/message')
const { today }  = require('../utils/date-utils')
const { isDate, isNumber, map } = require('lodash/fp')
const chatService = require('./chat-service').createService()

module.exports = (appLocalStorage) => {

    // register middleware that parses application/x-www-form-urlencoded
    router.use(bodyParser.urlencoded({ extended: true }))

    // register middleware that parses application/json
    router.use(bodyParser.json({ limit: '2mb' }))

    // macro-chat/api/get-messages
    router.get('/get-messages', getMessages)

    // macro-chat/api/get-users
    router.get('/get-users', getLoggedUsers)

    return router
}

async function getMessages (req, res) {

    const totalMessages = await Message.count({ room: 'General' })

    const querySentAt = isDate(req.query.lastSentAt) ? req.query.lastSentAt : today()
    const limit = isNumber(req.query.limit) ? (req.query.limit > 30 ? 30 : req.query.limit) : 30

    const messages = await Message.find({ sentAt: { $gt: querySentAt } }).limit(limit).exec()

    res.send({
        totalMessages,
        messages
    })
}

async function getLoggedUsers (req, res) {
    const users = map(u => u.username, chatService.loggedUsers)
    res.send({users})
}