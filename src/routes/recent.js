const express = require("express")
const router = express.Router()
const controller = require("./../controllers/recent.js")

//Available endpoints for /recent and the correspondning functions
const endpoints = {
  "/tracks" : (p) => controller.getRecentTracks(p),
  "/lyrics" : (p) => controller.getRecentLyrics(p),
  "/playcounts" : (p) => controller.getRecentPlaycounts(p),
  "/album_covers": (p) => controller.getRecentAlbumCovers(p),
  "/spotify_links": (p) => controller.getRecentSpotifyLinks(p),
}

const handleRequest = async (req, res, controllerFunction) => {
  try {
    var params = queryRequest(req, res)
    params['res'] = res

    const json = await controllerFunction(params)
    if (res.statusCode < 400)
      res.status(200).send(json)
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
  let params = {}

  //username
  //    - Always required
  const username = req.query.username
  if (username === undefined) res.status(400).send("400 - Username is undefined")
  else params["username"] = username

  //limit
  //    - Always optional 
  //    - Defaults to 5
  //    - Must be 0< and 20> 
  const limit = req.query.limit
  if (limit <= 0)
    res.status(400).send("400 - Limit has to be bigger than 0")
  else if (limit > 20)
    res.status(400).send("400 - Limit has to be smaller than 20")
  else if (limit === undefined)
    params["limit"] = 5
  else
    params["limit"] = limit

  return params
}

module.exports = router