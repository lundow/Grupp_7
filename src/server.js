const express = require('express')
const server = express()

const recentTracks = require("./routes/recentTracks.js")

server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:8000')
  next()
})

server.get("/", (req, res) => {
  res.send("root")
})

server.use("/recentTracks", recentTracks)

module.exports = server;