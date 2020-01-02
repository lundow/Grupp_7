const express = require("express")
const router = express.Router()
const controller = require("./../controllers/recent.js")

//Available endpoints for /recent and the correspondning functions
const endpoints = {
  "/": (p) => controller.getRecentTracks(p),
  "/tracks" : (p) => controller.getRecentTracks(p),
  "/lyrics" : (p) => controller.getRecentLyrics(p),
  "/playcounts" : (p) => controller.getRecentPlaycounts(p),
  "/track_and_poster": (p) => controller.getRecentTrackAndPoster(p),
  "/favourite_tracks": (p) => controller.getFavouriteTracks(p),
  // "/album_covers": (p) => ,
  // "/spotify_links": (p) => ,
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
  let params = {}
  const username = req.query.username
  if (username === undefined) res.status(400).send("Username is undefined")
  else params["username"] = username

  const limit = req.query.limit
  if (limit <= 0)
    res.status(400).send("Limit has to be bigger than 0")
  else if (limit >= 50)
    res.status(400).send("Limit has to be smaller than 50")
  else if (limit === undefined)
    params["limit"] = 5
  else
    params["limit"] = limit
  return params
}

module.exports = router