const server = require("./server.js")
const genius = require("./apis/genius.js")
const port = 8000

server.listen(port, () => {
  console.log("Server listening on port " + port)
})

