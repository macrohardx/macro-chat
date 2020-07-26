import config from '../config'
import { maybeGetUserDataFromJwtCookie } from '../utils/jwt-helpers'
import { createService } from './chat-service'
const io = require('socket.io')
const chatService = createService()

export const initChatSocket = (server: any, path: string) => {

    const socketServer = io(server, {
        path,
        transports: ['websocket']
    })

    socketServer.on('connection', async (socket) => {
        const maybeUser = await maybeGetUserDataFromJwtCookie(socket.handshake.headers.cookie, config.auth_cookie)
        if (!maybeUser.ok) {
            return socket.disconnect(true)
        }

        chatService.connectUser(maybeUser.result.username, socket);      

        socket.on('send-message', async (message) => {
            await chatService.newMessage(message)
        })

        // socket.on('message-received', async (messageId) => {
        //     let messageUser = await chatService.getUsernameFromMessageId(messageId)
        //     await chatService.setMessageReceived(messageId, userData.username)
        //     let senderSocket = chatService.getSocketByUsername(messageUser)
        //     if (senderSocket) {
        //         senderSocket.emit('message-received', userData.username)
        //     }
        // })

        // socket.on('message-read', async (messageId) => {
        //     let messageUser = await chatService.getUsernameFromMessageId(messageId)
        //     await chatService.setMessageRead(messageId, userData.username)
        //     let senderSocket = chatService.getSocketByUsername(messageUser)
        //     if (senderSocket) {
        //         senderSocket.emit('message-read', userData.username)
        //     }
        // })

        // socket.on('set-user-status', async (cb) => {
        //     chatService.setUserStatus(userData.username, 'away')
        //     cb(true)
        // })

        socket.on('disconnect', () => {
            if (maybeUser.ok) {
                chatService.disconnectUser(maybeUser.result.username)
            }
        })
    })

    return socketServer
}