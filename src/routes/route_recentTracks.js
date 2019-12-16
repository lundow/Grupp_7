const express = require("express")
const router = express.Router();
const controller = require("./../controllers/controller_recentTracks.js")

router.get("", async (req, res) => {
  try {
    const params = handleRequest(req, res)
    await controller.getRecentTracks(params)
    res.send(params)
  } catch (error) {
    res.status(400).send(error.message)
  }
})

const handleRequest = (req, res) => {
  const params = {}

  const username = req.query.username
  if (username === undefined) res.status(400).send("Username is undefined")
  else params["username"] = username

  const limit = req.query.limit
  if (limit <= 0) res.status(400).send("Limit has to be bigger than 0")
  else if (limit >= 50) res.status(400).send("Limit has to be smaller than 50")
  else params["limit"] = limit

  return params
}

module.exports = router