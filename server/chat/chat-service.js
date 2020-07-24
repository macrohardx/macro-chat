const _ = require('lodash')
const sanitizeHtml = require('sanitize-html')

const loggedUsers = []
const rooms = {}

class ChatService {

    constructor() {
        this.loggedUsers = []
    }

    createRoom(roomName) {
        if (rooms[roomName]) {
            return
        }
        rooms[roomName] = {
            users: []
        }
    }

    addUser(user) {
        if (_.some(this.loggedUsers, u => u.username === user.username)) {
            this.loggedUsers.push(user)
        }
    }

    removeUser(username) {
        _.remove(this.loggedUsers, (u) => u.username === username)
    }

    async addMessage(message) {
        let sanitizedMessage = sanitizeHtml(message.text)
        if (!sanitizedMessage) {
            throw new Error('Invalid message: couldn\'t sanitize message')
        }

        let referenceMessage
        if (message.referenceMessage) {
            referenceMessage = await Message.findById(message.referenceMessage)
        }

        return await Message.create({
            username: userData.username,
            text: sanitizedMessage,
            sentAt: new Date(),
            referenceMessage: referenceMessage,
            room: 'General'
        })
    }

    async getUsernameFromMessageId(messageId) {
        let message = await Message.findById(messageId)
        return message.username
    }

    getSocketByUsername(username) {
        return this.getUser(username).socket
    }

    setUserStatus(username, statusName) {
        let user = this.getUser(username)
        user.status = statusName
    }

    getUser(username) {
        return _.find(loggedUsers, u => u.username === username)
    }

}

let cachedService = null
module.exports = {
    /**
     * @returns {ChatService}
     */
    createService: () => {
        cachedService = cachedService || new ChatService()
        return cachedService
    }
}