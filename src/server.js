const express = require('express')
const server = express()

server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:8000')
  next()
})

server.get("/", (req, res) => {
  res.send("root")
})

const recent = require("./routes/recent.js")
server.use("/recent", recent)

const search = require("./routes/search.js")
server.use("/search", search)

const top = require("./routes/top.js")
server.use("/top", top)

module.exports = server;