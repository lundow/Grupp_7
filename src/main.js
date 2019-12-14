const lastFM = require("./lastFM.js")
const musixmatch = require("./musixmatch.js")

const username = "Buden1"

const getData = async () => {
  const track = await lastFM.getCurrentTrack(username)
  const track_id = await musixmatch.getTrackID(track)
  console.log(await musixmatch.getLyrics(track_id))
}

getData()