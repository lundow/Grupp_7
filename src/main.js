const server = require("./server.js")
const spotify = require("./apis/spotify.js")
const port = 8000

server.listen(port, () => {
  console.log("Server listening on port " + port)
  getToken();
})


  getToken = async () => {
    await spotify.fetchToken()
    var albumart = await spotify.getAlbumCover("kiss", "strutter", "track", "1");
    console.log(albumart);
}
