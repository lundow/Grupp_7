const genius = require("./../apis/genius.js")
const scraper = require("./../scraper.js")

const getLyrics = async (params) => {
  var res = await genius.searchFor(params.track + " " + params.artist)
  var track = res.hits[0].result
  var path = track.path
  var lyrics = await scraper.scrapeLyrics(path)

  var json = {
    "track": track.title,
    "artist": track.primary_artist.name,
    "lyrics": lyrics
  }
  return json
}

const getPlaycounts = async (params) => {

}

const getCover = async (params) => {

}

module.exports = {
  getLyrics,
  getPlaycounts,
  getCover,
}