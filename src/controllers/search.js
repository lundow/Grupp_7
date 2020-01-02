const lastFM = require("./../apis/lastFM.js")
const genius = require("./../apis/genius.js")
const scraper = require("./../scraper.js")

const getLyrics = async (params) => {
  const res = await genius.searchFor(params.track + " " + params.artist)
  const track = res.hits[0].result
  const path = track.path
  const lyrics = await scraper.scrapeLyrics(path)

  return {
    "track": track.title,
    "artist": track.primary_artist.name,
    "lyrics": lyrics
  }
}

const getPlaycount = async (params) => {
  const res = await lastFM.getTrackInfo(params)
  
  return {
    "track": res.name,
    "artist": res.artist.name,
    "playcount": res.userplaycount
  }
}

const getCover = async (params) => {

}

module.exports = {
  getLyrics,
  getPlaycount,
  getCover,
}