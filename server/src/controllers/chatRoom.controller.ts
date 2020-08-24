import '../chat/model/user'
import { Types } from 'mongoose'
import { inject } from 'inversify'
import { controller, httpGet, httpPost, httpPut, httpDelete, requestParam, BaseHttpController, requestBody } from 'inversify-express-utils'
import { RoomRepository } from '../infrastructure/data-access/repositories/room-repository';
import { TYPES } from '../config/types';
import * as HttpStatusCode from 'http-status-codes';
import { Room } from '../domain/model/room';


@controller('/api/v1/room')
export class ChatRoomController extends BaseHttpController {

    @inject(TYPES.RoomRepository) _roomRepository: RoomRepository

    @httpGet('/all/:userId')
    private async getAllUsersRooms(@requestParam('userId') userId: Types.ObjectId): Promise<Room[]> {
        return await this._roomRepository.queryAllIncludeUser({ users: userId })
    }

    @httpPost('/create')
    private async createRoom(@requestBody() body) {
        const roomExists = (await this._roomRepository.queryAll({ name: body.name })).length > 0
        if (roomExists) {
            return this.json({ error: "A room with the same name already exists" }, HttpStatusCode.CONFLICT)
        }
        const room = await this._roomRepository.save(<Room>{
            name: body.name,
            owner: body.owner,
            users: [body.owner]
        })
        return this.json({data:room}, HttpStatusCode.CREATED)
    }

    @httpDelete('/delete/:roomId')
    private async deleteRoom(@requestParam('roomId') roomId) {
        await this._roomRepository.removeAll({ _id: roomId })
    }
}

// export class ChatRoomRouter {

//     private router: express.Router = express.Router()
//     @inject(TYPES.ChatRoomService) private _chatRoomService: IChatRoomService

//     constructor() {
//         this.router.use(bodyParser.urlencoded({ extended: true }))
//             .use(bodyParser.json({ limit: '2mb' }))
//         this.registerRoutes(this.router)
//     }

//     private async registerRoutes(router) {
//         router.put('/addUser/:user-:room', this.addUserToRoom.bind(this))
//         router.delete('/removeUser/:user-room', this.removeUserFromRoom.bind(this))
//     }

//     private async addUserToRoom(req, res) {
//         let room = await Room.findOne({ name: req.params.room })
//         if (!room) {
//             return res.status(HttpStatusCode.NOT_FOUND).send({ error: 'Room not found' })
//         }
//         let user = await User.findOne({ username: req.params.user })
//         if (!user) {
//             return res.status(HttpStatusCode.NOT_FOUND).send({ error: 'User not found' })
//         }
//         if (room.users.indexOf(user._id) !== -1) {
//             return res.status(HttpStatusCode.CONFLICT).send({ error: 'User already in the room' })
//         }
//         room.users.push(Types.ObjectId(user._id))
//         await room.save()
//         return res.sendStatus(HttpStatusCode.OK)
//     }

//     private async removeUserFromRoom(req, res) {
//         let room = await Room.findOne({ name: req.params.room })
//         if (!room) {
//             return res.status(HttpStatusCode.NOT_FOUND).send({ error: 'Room not found' })
//         }
//         let user = await User.findOne({ username: req.params.user })
//         if (!user) {
//             return res.status(HttpStatusCode.NOT_FOUND).send({ error: 'User not found' })
//         }
//         room.users.pull(user._id)
//         await room.save()
//         return res.sendStatus(HttpStatusCode.OK)
//     }

//     public GetRouter(): express.Router {
//         return this.router
//     }
// }