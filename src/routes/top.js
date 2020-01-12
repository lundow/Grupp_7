const express = require("express")
const router = express.Router()
const controller = require("./../controllers/top.js")

//Available endpoints for /recent and the correspondning functions
const endpoints = {
  "/tracks": (p) => controller.getTopTracks(p),
  "/lyrics": (p) => controller.getTopLyrics(p),
  "/playcounts" : (p) => controller.getTopPlaycounts(p),
  "/covers": (p) => controller.getTopAlbumCovers(p),
  "/links": (p) => controller.getTopSpotifyLinks(p),

  "/artists": (p) => controller.getFavouriteArtists(p),
  "/albums": (p) => controller.getTopAlbums(p)
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
  else if (limit >= 20)
    res.status(400).send("400 - Limit has to be smaller than 20")
  else if (limit === undefined)
    params["limit"] = 5
  else
    params["limit"] = limit

  return params
}

module.exports = router