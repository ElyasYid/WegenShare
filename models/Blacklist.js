const mongoose = require('mongoose')

const blacklistSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true
    },
    addedAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Blacklist', blacklistSchema)