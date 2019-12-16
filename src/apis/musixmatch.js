const api = require("./fetch.js")
const keys = require("./../../keys.json")
const url = "http://api.musixmatch.com/ws/1.1/"
const key = "&apikey=" + keys.musixmatch

const getTrackID = async (track) => {
  const track_query = "&q_track=" + track.name
  const artist_query = "&q_artist=" + track.artist['#text']
  const rating_sort = "&s_track_rating=" + "DESC"

  const method = "track.search?" + track_query + artist_query + rating_sort
  const req_url = url + method + key

  const json = await api.getData(req_url)
  return json.message.body.track_list[0].track.track_id
}

const getLyrics = async (track_id) => {
  console.log(track_id)
  const method = "track.lyrics.get?track_id=" + track_id
  const req_url = url + method + key
  const json = await api.getData(req_url)
  console.log(json.message.body)
}

module.exports = {
  getTrackID,
  getLyrics
}