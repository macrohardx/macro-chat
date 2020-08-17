import { check } from 'express-validator'

export const createRoomValidations = [
    check('name').isString().isLength({ min: 5, max: 100 }),
    check('owner').isString().isLength({ min: 24, max: 24 })
]