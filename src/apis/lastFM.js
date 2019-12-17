const api = require("./fetch.js")
const keys = require("./../../keys.json")
const url = "http://ws.audioscrobbler.com/2.0/"
const key = "&api_key=" + keys.lastFM
const format = "&format=json"

const getRecentTracks = async (username, limit) => {
  const limit_query = "&limit=" + limit
  const user_query = "&user=" + username

  const method = "?method=user.getrecenttracks" + limit_query + user_query
  const req_url = url + method + key + format

  const json = await api.getData(req_url)
  const tracks = json.recenttracks.track
  return tracks
}

module.exports = {
  getRecentTracks
}