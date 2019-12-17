const express = require('express')
const server = express()

const recent = require("./routes/recent.js")

server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:8000')
  next()
})

server.get("/", (req, res) => {
  res.send("root")
})

server.use("/recent", recent)

module.exports = server;