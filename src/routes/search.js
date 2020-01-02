const express = require("express")
const router = express.Router()
const controller = require("./../controllers/search.js")

//Available endpoints for /search and the correspondning functions
const endpoints = {
  "/lyrics": (p) => controller.getLyrics(p),
  "/playcounts": (p) => controller.getPlaycount(p),
  "/cover": (p) => controller.getCover(p),
  // "/spotify_links": (p) => ,
  // "/user": (p) => ,
}

const handleRequest = async (req, res, controllerFunction) => {
  try {
    const params = queryRequest(req, res)
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
  //    - only required for /playcounts
  const username = req.query.username
  if (username === undefined && path === "/playcounts")
    res.status(400).send("Username is undefined")
  else params["username"] = username

  //track
  const track = req.query.track
  if (track === undefined) res.status(400).send("Track is undefined")
  else params["track"] = track

  //artist
  const artist = req.query.artist
  if (track === undefined) res.status(400).send("Artist is undefined")
  else params["artist"] = artist

  return params
}

module.exports = router