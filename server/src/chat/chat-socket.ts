import io from 'socket.io'
import config from '../config'
import { maybeGetUserDataFromJwtCookie } from '../utils/jwt-helpers'
import { createService } from './chat-service'
const chatService = createService()

const initSocket = (server, path) => {

    const socketServer = io(server, {
        path,
        transports: ['websocket']
    })

    socketServer.on('connection', async (socket) => {
        const userDataResult = await maybeGetUserDataFromJwtCookie(socket.handshake.headers.cookies, config.auth_cookie)
        if (userDataResult.error) {
            return socket.disconnect(true)
        }

        const userData = { username: 'foo' } //userDataResult.decoded
        let user = chatService.getUser(userData.username)
        if (user && user.disconnectTimeoutId) {
            clearTimeout(user.disconnectTimeoutId)
            user.socket = socket
        }
        else {
            chatService.addUser({
                username: userData.username,
                socket,
                status: 'online'
            })
            socket.broadcast.emit('new-user', userData.username)
        }        

        socket.on('send-message', async (message, messageRegisteredCb) => {
            let newMessage = await chatService.addMessage(message)
            socket.broadcast.emit('new-message', newMessage)
            messageRegisteredCb(newMessage)
        })

        socket.on('message-received', async (messageId) => {
            let messageUser = await chatService.getUsernameFromMessageId(messageId)
            await chatService.setMessageReceived(messageId, userData.username)
            let senderSocket = chatService.getSocketByUsername(messageUser)
            if (senderSocket) {
                senderSocket.emit('message-received', userData.username)
            }
        })

        socket.on('message-read', async (messageId) => {
            let messageUser = await chatService.getUsernameFromMessageId(messageId)
            await chatService.setMessageRead(messageId, userData.username)
            let senderSocket = chatService.getSocketByUsername(messageUser)
            if (senderSocket) {
                senderSocket.emit('message-read', userData.username)
            }
        })

        socket.on('set-user-status', async (cb) => {
            chatService.setUserStatus(userData.username, 'away')
            cb(true)
        })

        socket.on('disconnect', () => {

            // Wait 30 seconds before assuming user disconnected
            let user = chatService.getUser(userData.username)
            user.disconnectTimeoutId = setTimeout(() => {
                chatService.removeUser(userData.username)
                socket.broadcast.emit('user-left', userData.username)
            }, 30000)
        })
    })

    return socketServer
}


module.exports = initSocket