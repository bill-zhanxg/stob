const { Schema, model } = require("mongoose")

const commands = Schema({
  guild: {
    type: String,
    require: true
  },
  commands: {
    type: Array,
    require: true
  },
})

module.exports = model("disabled-commands", commands);