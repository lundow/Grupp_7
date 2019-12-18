const server = require("./server.js")
const spotify = require("./apis/spotify.js")
const port = 8000

server.listen(port, () => {
  console.log("Server listening on port " + port)
  spotify.getAccessToken();
})
