const fetch = require('node-fetch')
const cheerio = require('cheerio')
const genius_url = "https://genius.com"

const scrapeLyrics = async (path) => {
  const url = genius_url + path
  var res = await fetch(url)
  var body = await res.text()

  const $ = cheerio.load(body)
  var lyrics = $(".lyrics").text()
  console.log(lyrics)
  return lyrics
}

module.exports = {
  scrapeLyrics
}