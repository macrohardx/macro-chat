
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const messageSchema = new Schema({
    text: { type: String, required: true },
    username: { type: String, required: true },
    sentAt: { type: Date, required: true },
    referenceMessage: { type: String, required: false },
    room: { type: String, required: true }
})

module.exports = mongoose.model('Message', messageSchema, 'messages')