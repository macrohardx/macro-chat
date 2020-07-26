import _ from 'lodash'
import * as sanitizeHtml from 'sanitize-html'
import { Message } from './model/message'
import { Room, IRoom } from './model/room';
import { IMaybe } from '../utils/maybe';

const defaultRoomName = 'general'
const loggedUsers = {}
const activeRooms = {}

class ChatService {

    public loggedUsers = []

    constructor() {
    }

    public connectUser(username: string, socket: any): void {
        let user = loggedUsers[username]
        if (!user) {
            loggedUsers[username] = {
                username: username,
                joinedAt: new Date(),
                status: 'online',
                socket: socket
            }
            this.joinRoom(username, defaultRoomName)
        }
        else if (user.disconnectTimeoutId) {
            clearTimeout(user.disconnectTimeoutId)
        }
    }

    public async joinRoom(username: string, roomName: string): Promise<void> {
        let user = loggedUsers[username]
        let room = await this.getOrCreateRoom(roomName)
        user.rooms = (user.rooms || [])
        user.rooms.push(room)
        user.socket.join(room.name)
        user.socket.to(room.name).emit('user-joined-room', username)
    }

    private async getOrCreateRoom(roomName: string): Promise<IRoom> {
        let { result, ok } = await this.maybeGetRoom(roomName)
        if (ok) {
            return result
        }
        else  { // If not found create a new room and add it to memory
            let room = await Room.create({ name: roomName, createdAt: new Date() })
            activeRooms[roomName] = room
            return room
        }
    }

    private async maybeGetRoom(roomName: string): Promise<IMaybe<IRoom>> {
        return new Promise(async (resolve) => {
            // Try to get room from memory
            let room = activeRooms[roomName]
            // Try to get room from database
            if (!room) {
                room = await Room.findOne({ name: roomName })
            }
            return room ? { ok: true, result: room } : { ok: false}
        })
    }

    public disconnectUser(username: string): void {
        let user = loggedUsers[username]
        if (!user) return

        // TODO set user status to away

        // Give user 30 seconds to return before removing his data from memory
        user.disconnectTimeoutId = setTimeout(() => {
            this.removeUser(user.username)
            user.socket.broadcast.emit('user-left', user.username)
        }, 30 * 1000)
    }

    private removeUser(username: string): void {
        delete this.loggedUsers[username]
    }

    public async newMessage(message) : Promise<void> {
        let sanitizedMessage = sanitizeHtml(message.text)
        if (!sanitizedMessage) {
            return Promise.reject('Unable to sanitize message')
        }

        let user = loggedUsers[message.username]
        if (!user || !user.socket) {
            return Promise.reject('Invalid user name')
        }

        let maybeRoom = await this.maybeGetRoom(message.roomName)
        if (!maybeRoom.ok) {
            return Promise.reject('Invalid room name')            
        }

        if (message.replyTo) {
            let replyMessageExists = await Message.exists(message.replyTo)
            if (!replyMessageExists) {
                return Promise.reject('Reply message not found')
            }
        }

        let savedMessage = await Message.create({
            username: message.username,
            text: sanitizedMessage,
            room: maybeRoom.result._id,
            replyMessage: message.replyTo
        })

        user.socket.to(maybeRoom.result.name).emit('new-message', savedMessage)
    }
}

// Cache makes sure to return always the same instance of the service (singleton)
let cachedService = null
export const createService = (): ChatService => {
    cachedService = cachedService || new ChatService()
    return cachedService
}