import * as express from 'express'
const router     = express.Router()
const bodyParser = require('body-parser')
import * as HttpStatusCode from 'http-status-codes'
import { Room, IRoom } from '../model/room'
import { User } from '../model/user'
import { Types } from 'mongoose';
import { createRoomValidations } from './validations/create-room.validation';
import container from '../../invesrify.config';
import { IChatRoomService } from './chat-room.service';
import { TYPES } from '../../types';

export const ChatRoomRouter = () => {

    // register middleware that parses application/x-www-form-urlencoded
    router.use(bodyParser.urlencoded({ extended: true }))

    // register middleware that parses application/json
    router.use(bodyParser.json({ limit: '2mb' }))

    // Get all rooms that the user has access to
    router.get('/all/:userId', async (req:any, res, next) => {
        let rooms = await Room.find({ users: req.params.userId })
        res.send(rooms)
    })

    router.post('/create', createRoomValidations, async (req, res, next) => {
        let roomExists = await Room.exists({ name: req.body.name })
        if (roomExists) {
            return res.status(HttpStatusCode.CONFLICT).send({ error: "A room with the same name already exists" });
        }
        let room = await Room.create<IRoom>({ name: req.body.name, owner: req.body.owner, users: [req.body.owner] })
        return res.status(HttpStatusCode.CREATED).send({ room })
    })    

    router.delete('/delete/:room', async (req, res, next) => {
        await Room.remove({ name: req.params.room })
        return res.sendStatus(HttpStatusCode.OK)
    })

    router.put('/assign/:user-:room', async (req, res, next) => {
        let room = await Room.findOne({ name: req.params.room })
        if (!room) {
            return res.status(HttpStatusCode.NOT_FOUND).send({ error: 'Room not found' })
        }
        let user = await User.findOne({ username: req.params.user })
        if (!user) {
            return res.status(HttpStatusCode.NOT_FOUND).send({ error: 'User not found' })
        }
        if (room.users.indexOf(user._id) !== -1) {
            return res.status(HttpStatusCode.CONFLICT).send({ error: 'User already in the room' })
        }
        room.users.push(Types.ObjectId(user._id))
        await room.save()
        return res.sendStatus(HttpStatusCode.OK)
    })

    router.delete('/unassign/:user-:room', async (req, res, next) => {
        let room = await Room.findOne({ name: req.params.room })
        if (!room) {
            return res.status(HttpStatusCode.NOT_FOUND).send({ error: 'Room not found' })
        }
        let user = await User.findOne({ username: req.params.user })
        if (!user) {
            return res.status(HttpStatusCode.NOT_FOUND).send({ error: 'User not found' })
        }
        room.users.pull(user._id)
        await room.save()
        return res.sendStatus(HttpStatusCode.OK)
    })
    
    return router
}