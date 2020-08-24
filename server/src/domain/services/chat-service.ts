// import * as _ from 'lodash'
// import * as sanitizeHtml from 'sanitize-html'
// import { IMaybe } from '../../utils/maybe';
// import { RoomModel } from '../../infrastructure/data-access/repositories/room-repository';
// const { EventEmitter } = require('events');

// const defaultRoomName = 'general'

// class ChatService {

//     private loggedUsers = {}

//     private activeRooms = {}

//     public emitter = new EventEmitter()

//     private socketServer

//     constructor(socketServer) {
//         this.socketServer = socketServer
//         this.emitter.on('user-logged-in', (user) => {
//             if (user.disconnectTimeoutId) {
//                 clearTimeout(user.disconnectTimeoutId)
//             }
//         })
//     }

//     public async connectUser(username: string, socket: any): Promise<boolean> {
//         let user = this.loggedUsers[username]
//         if (!user) {
//             this.loggedUsers[username] = {
//                 username: username,
//                 joinedAt: new Date(),
//                 status: 'online',
//                 sockets: [socket]
//             }
//             await this.joinRoom(username, defaultRoomName, socket)
//         }
//         else {
//             user.sockets.push(socket)
//             for (let r of user.rooms) {
//                 user.socket.join(r)
//             }
//         }        
//         this.emitter.emit('user-logged-in', user)
//         return Promise.resolve(true)
//     }

//     public async joinRoom(username: string, roomName: string, socket) {
//         let user = this.loggedUsers[username]
//         let room = await this.getOrCreateRoom(roomName)
//         user.rooms = (user.rooms || [])
//         user.rooms.push(room)
//         socket.join(room.name)
//         this.socketServer.in(room.name).emit('user-joined-room', username)
//     }

//     private async getOrCreateRoom(roomName: string): Promise<RoomModel> {
//         let maybeRoom = await this.maybeGetRoom(roomName)
//         if (maybeRoom.ok) {
//             return Promise.resolve(maybeRoom.result)
//         }
//         else  { // If not found create a new room and add it to memory
//             let room = await Room.create({ name: roomName, createdAt: new Date(), owner: 'dsfdfsdfddf' })
//             this.activeRooms[roomName] = room
//             return Promise.resolve(room)
//         }
//     }

//     private async maybeGetRoom(roomName: string): Promise<IMaybe<RoomModel>> {
//         // Try to get room from memory
//         let room = this.activeRooms[roomName]
//         // Try to get room from database
//         if (!room) {
//             room = await Room.findOne({ name: roomName })
//         }
//         return room ? Promise.resolve({ ok: true, result: room }) : Promise.resolve({ ok: false})
//     }

//     public disconnectUser(username: string, socket: any): void {
//         let user = this.loggedUsers[username]
//         if (!user) return

//         _.remove(user.sockets, (s) => s === socket)

//         // TODO set user status to away

//         // Give user 30 seconds to return before removing his data from memory
//         user.disconnectTimeoutId = setTimeout(() => {
//             if (user.sockets.length === 0) {
//                 this.removeLoggedUser(user.username)
//                 user.socket.broadcast.emit('user-left', user.username)
//             }
//         }, 30 * 1000)
//     }

//     private removeLoggedUser(username: string): void {
//         delete this.loggedUsers[username]
//     }

//     public async newMessage(message, socket) : Promise<void> {
//         let sanitizedMessage = sanitizeHtml(message.text)
//         if (!sanitizedMessage) {
//             return Promise.reject('Unable to sanitize message')
//         }

//         let user = this.loggedUsers[message.username]
//         if (!user || !user.sockets) {
//             return Promise.reject('Invalid user name')
//         }

//         let maybeRoom = await this.maybeGetRoom(message.roomName)
//         if (!maybeRoom.ok) {
//             return Promise.reject('Invalid room name')            
//         }

//         if (message.replyTo) {
//             let replyMessageExists = await Message.exists(message.replyTo)
//             if (!replyMessageExists) {
//                 return Promise.reject('Reply message not found')
//             }
//         }

//         let savedMessage = await Message.create({
//             username: message.username,
//             text: sanitizedMessage,
//             room: maybeRoom.result._id,
//             replyMessage: message.replyTo
//         })

//         socket.to(maybeRoom.result.name).emit('new-message', savedMessage)
//     }
// }

// // Cache makes sure to return always the same instance of the service (singleton)
// let cachedService = null
// export const createService = (socketServer): ChatService => {
//     cachedService = cachedService || new ChatService(socketServer)
//     return cachedService
// }