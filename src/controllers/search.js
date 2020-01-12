const lastFM = require("./../apis/lastFM.js")
const genius = require("./../apis/genius.js")
const spotify = require("./../apis/spotify.js")
const scraper = require("./../scraper.js")

/*
	Sends a request to the Genius API with specific keywords,
	searching lyrics for corresponding artist name and song name.
*/
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

/*
	Fetches the play count of a specific song from the lastFM api.
*/
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

/*
	Fetches the album cover of a specific song from a specific artist. 
*/
const getAlbumCover = async (params) => {
  const token = await spotify.fetchToken();
  const spotifyInfo = await spotify.getTrackInfo(params.artist, params.name, "track", 1);
  var result = {
    "track":  params.name,
    "artist": params.artist
  };
  result.albumCover = await spotifyInfo.albumCover;
  return result;
}

/*
	Fethes the link to a specific song from Spotify API. 
*/
const getSpotifyLink = async (params) => {
  const token = await spotify.fetchToken();
  const spotifyInfo = await spotify.getTrackInfo(params.artist, params.name, "track", 1);
  var result = {
    "track":  params.name,
    "artist": params.artist
  };
  result.uri = await spotifyInfo.uri;
  return result;
}

/*
	Requests user information from Last FMapi.
*/
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

/*
	Exports modules so that you can include them in other modules using the require() method.
*/
module.exports = {
  getLyrics,
  getPlaycount,
  getUserInfo,
  getAlbumCover,
  getSpotifyLink
}