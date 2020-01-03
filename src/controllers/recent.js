const lastFM = require("./../apis/lastFM.js")
const spotify = require("./../apis/spotify.js")
const genius = require("./../apis/genius.js")
const scraper = require("./../scraper.js")

const getRecentCombined = async (params) => {
  //TODO
}

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

const getRecentTrackAndPoster = async (params) => {
  var res = await getRecentTracks(params);
  const token = await spotify.fetchToken();

  const result = await Promise.all(res.map(async (track) => {
    var spotifyInfo = await spotify.getTrackInfo(track.artist, track.name, "track", 1);
    track.albumCover = await spotifyInfo.albumCover;
    track.spotifyURI = await spotifyInfo.uri;
    return await track;
  }));
  return result;
}

const getFavouriteTracks = async (params) => {
  const favourite_tracks = await lastFM.getFavouriteTracks(params.username, params.limit)

  var tracks = []
  for (var i in favourite_tracks["track"]) {
    var track = favourite_tracks.track[i];
    if (track.length === 0) track = undefined
    tracks.push(track)

    //console.log(favourite_tracks.track[i].name) - namn på låt
    //console.log(favourite_tracks.track[i].artist.name) - namn på artist

  }
  return tracks
}

module.exports = {
  getRecentCombined,
  getRecentTracks,
  getRecentLyrics,
  getRecentPlaycounts,
  getFavouriteTracks,
  getRecentTrackAndPoster,
}
