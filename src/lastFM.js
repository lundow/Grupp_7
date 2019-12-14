const api = require("./api.js")
const keys = require("./../keys.json")
const url = "http://ws.audioscrobbler.com/2.0/"
const key = "&api_key=" + keys.lastFM
const format = "&format=json"

const getCurrentTrack = async (username) => {
  const limit_query = "&limit=1"
  const user_query = "&user=" + username
  
  const method = "?method=user.getrecenttracks" + limit_query + user_query
  const req_url = url + method + key + format

  const json = await api.getData(req_url)
  const track = json.recenttracks.track[0]
  return track
}

module.exports = {
  getCurrentTrack
}