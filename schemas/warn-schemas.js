const { Schema, model } = require("mongoose")

const countWarns = Schema({
  //The server id
  id: {
    type: String,
    require: true
  },
  //user id
  userId: {
    type: String,
    require: true
  },
  //Warn counts
  WarnCounts: {
    type: Number,
    require: true
  },
})

module.exports = model("Count-Users-Warnings", countWarns)