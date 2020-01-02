const express = require("express")
const router = express.Router()
const controller = require("./../controllers/search.js")

//Available endpoints for /search and the correspondning functions
const endpoints = {
  "/lyrics": (p) => controller.getLyrics(p),
  "/playcount": (p) => controller.getPlaycount(p),
  "/cover": (p) => controller.getCover(p),
  // "/spotify_links": (p) => ,
  // "/user": (p) => ,
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
  //    - Only required for /playcount
  const username = req.query.username
  if (username === undefined && path === "/playcount")
    res.status(400).send("400 - Username is undefined")
  else params["username"] = username

  //track
  const track = req.query.track
  if (track === undefined) res.status(400).send("400 - Track is undefined")
  else params["name"] = track

  //artist
  const artist = req.query.artist
  if (track === undefined) res.status(400).send("400 - Artist is undefined")
  else params["artist"] = artist

  return params
}

module.exports = router