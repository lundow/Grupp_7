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

const getTrackInfo = async (params) => {
  const track_query = "&track=" + params.track
  const artist_query = "&artist=" + params.artist
  const user_query = "&user=" + params.username

  const method = "?method=track.getInfo" + user_query + track_query + artist_query
  const req_url = url + method + key + format

  const json = await api.getData(req_url)
  const info = json.track
  return info
}

const getFavouriteTracks = async (username, limit) => {
  const limit_query = "&limit=" + limit
  const user_query = "&user=" + username

  const method = "?method=user.gettoptracks" + limit_query + user_query
  const req_url = url + method + key + format

  const json = await api.getData(req_url)

  const favourite_tracks = json.toptracks
  return favourite_tracks
}

module.exports = {
  getRecentTracks,
  getTrackInfo,
  getFavouriteTracks
}
