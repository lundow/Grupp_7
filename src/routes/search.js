const express = require("express")
const router = express.Router()
const controller = require("./../controllers/search.js")

//Available endpoints for /search and the correspondning functions
const endpoints = {
  "/lyrics": (p) => controller.getLyrics(p),
  "/playcount": (p) => controller.getPlaycount(p),
  "/cover": (p) => controller.getCover(p),
  "/user": (p) => controller.getUserInfo(p),
  // "/spotify_link": (p) => ,
}

const handleRequest = async (req, res, controllerFunction) => {
  try {
    var params = queryRequest(req, res)
    params['res'] = res

    if (res.statusCode < 400)
      res.status(200).send(await controllerFunction(params))
  } catch (error) {
    res.status(400).send(error.message)
  }
}

for (let key in endpoints) {
  router.get(key, (req, res) => {
    handleRequest(req, res, endpoints[key])
  })
}

const queryRequest = (req, res) => {
  const path = req.path
  let params = {}

  //username
  //    - Required for /playcount & /user
  const username = req.query.username
  console.log(username)

  if (path === "/playcount" || path === "/user")
    if (username === undefined || username.length < 1)
      res.status(400).send("400 - Username is undefined")
    else params["username"] = username

  //track
  //    - Required for /lyrics, /playcount & /cover
  const track = req.query.track
  if (path === "/lyrics" || path === "/playcount" || path === "/cover")
    if (track === undefined || track.length < 1)
      res.status(400).send("400 - Track is undefined")
    else params["name"] = track

  //artist
  //    - Required for /lyrics, /playcount & /cover
  const artist = req.query.artist
  if (path === "/lyrics" || path === "/playcount" || path === "/cover")
    if (artist === undefined || artist.length < 1) 
      res.status(400).send("400 - Artist is undefined")
    else params["artist"] = artist

return params
}

module.exports = router