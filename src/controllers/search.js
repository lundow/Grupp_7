const lastFM = require("./../apis/lastFM.js")
const genius = require("./../apis/genius.js")
const scraper = require("./../scraper.js")

const getLyrics = async (params) => {
  const res = await genius.searchFor(params.name + " " + params.artist)
  const hits = res.response.hits

  if (hits.length === 0) {
    params.res.status(404).send("404 - Lyrics not found")
    return
  }

  const track = hits[0].result
  const path = track.path
  const lyrics = await scraper.scrapeLyrics(path)
  return {
    "track": track.title,
    "artist": track.primary_artist.name,
    "lyrics": lyrics
  }
}

const getPlaycount = async (params) => {
  const userInfo = await lastFM.getUserInfo(params)
  const error = userInfo.error
  if (error === 6) {
    params.res.status(404).send("404 - User not found")
    return
  }

  const res = await lastFM.getTrackInfo(params)
  return {
    "track": res.name,
    "artist": res.artist.name,
    "playcount": res.userplaycount
  }
}

const getCover = async (params) => {

}

const getUserInfo = async (params) => {
  const userInfo = await lastFM.getUserInfo(params)
  const error = userInfo.error
  if (error === 6) {
    params.res.status(404).send("404 - User not found")
    return
  }

  return {
    "totalplaycount": userInfo.user.playcount,
    "url": userInfo.user.url,
    "registered": userInfo.user.registered
  }
}

module.exports = {
  getLyrics,
  getPlaycount,
  getCover,
  getUserInfo,
}