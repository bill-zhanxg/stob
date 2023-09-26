const mongoose = require('mongoose')
const { mongoPath } = require('./config.json')

module.exports = async () => {
    return await mongoose.connect(mongoPath)
}