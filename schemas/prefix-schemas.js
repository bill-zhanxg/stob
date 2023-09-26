const { Schema, model } = require("mongoose")

const prefix = Schema({
  //The server id
  guild: {
    type: String,
    require: true
  },
  prefix: {
    type: String,
    require: true
  },
})

module.exports = model("prefixes", prefix)