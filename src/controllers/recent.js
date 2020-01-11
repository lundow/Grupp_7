const lastFM = require("./../apis/lastFM.js")
const spotify = require("./../apis/spotify.js")
const genius = require("./../apis/genius.js")
const scraper = require("./../scraper.js")

const getRecentTracks = async (params) => {
  const response = await lastFM.getRecentTracks(params.username, params.limit)

  const error = response.error
  if (error === 6) {
    params.res.status(404).send("404 - User not found")
    return
  }

  const recentTracks = response.recenttracks.track
  var tracks = []
  for (var i = 0; i < params.limit; i++) {
    var track = recentTracks[i]
    tracks.push({
      "name": track.name,
      "artist": track.artist['#text']
    })
  }
  return tracks
}

const getRecentLyrics = async (params) => {
  const recentTracks = await getRecentTracks(params)
  var tracks = []

  for (var i in recentTracks) {
    var track = recentTracks[i]
    var res = await genius.searchFor(track.name + " " + track.artist)
    if (res.response.hits[0] !== undefined) {
      var path = res.response.hits[0].result.path
      var lyrics = await scraper.scrapeLyrics(path)

      tracks.push({
        "name": track.name,
        "artist": track.artist,
        "lyrics": lyrics
      })
    } else {
      tracks.push({
        "name": track.name,
        "artist": track.artist,
        "lyrics": '404 - Lyrics not found'
      })
    }
  }
  return tracks
}

const getRecentPlaycounts = async (params) => {
  const recentTracks = await getRecentTracks(params)
  var tracks = []

  for (var i in recentTracks) {
    var track = recentTracks[i]
    var trackParams = {
      "name": track.name,
      "artist": track.artist,
      "username": params.username
    }
    var trackInfo = await lastFM.getTrackInfo(trackParams)
    var playCount = trackInfo.userplaycount

    tracks.push({
      "name": track.name,
      "artist": track.artist,
      "playcount": playCount
    })
  }
  return tracks
}

const getRecentAlbumCovers = async (params) => {
  var res = await getRecentTracks(params);
  const token = await spotify.fetchToken();

  const result = await Promise.all(res.map(async (track) => {
    var spotifyInfo = await spotify.getTrackInfo(track.artist, track.name, "track", 1);
    track.albumCover = await spotifyInfo.albumCover;
    return await track;
  }));
  return result;
}

const getRecentSpotifyLinks = async (params) => {
  var res = await getRecentTracks(params);
  const token = await spotify.fetchToken();

  const result = await Promise.all(res.map(async (track) => {
    var spotifyInfo = await spotify.getTrackInfo(track.artist, track.name, "track", 1);
    track.spotifyURI = await spotifyInfo.uri;
    return await track;
  }));
  return result;
}

module.exports = {
  getRecentTracks,
  getRecentLyrics,
  getRecentPlaycounts,
  getRecentAlbumCovers,
  getRecentSpotifyLinks,
}
