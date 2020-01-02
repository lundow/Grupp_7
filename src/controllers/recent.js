const lastFM = require("./../apis/lastFM.js")
const spotify = require("./../apis/spotify.js")
const genius = require("./../apis/genius.js")
const scraper = require("./../scraper.js")

const getRecentCombined = async (params) => {
  //TODO
}

const getRecentTracks = async (params) => {
  const recentTracks = await lastFM.getRecentTracks(params.username, params.limit)
  var tracks = []

  for (var i in recentTracks) {
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
    if (res.hits[0] !== undefined) {
      var path = res.hits[0].result.path
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
        "lyrics": '404'
      })
    }
  }
  return tracks
}

const getRecentPlaycounts = async (params) => {
  const recentTracks = await lastFM.getRecentTracks(params.username, params.limit)
  var tracks = []

  for (var i in recentTracks) {
    var track = recentTracks[i]
    var trackParams = {
      "name": track.name,
      "artist": track.artist['#text'],
      "username": params.username
    }
    var trackInfo = await lastFM.getTrackInfo(trackParams)
    var playCount = trackInfo.userplaycount

    tracks.push({
      "name": track.name,
      "artist": track.artist['#text'],
      "playcount": playCount
    })
  }
  return tracks
}

const getRecentTrackAndPoster = async (params) => {
  var res = await lastFM.getRecentTracks(params.username, params.limit);
  const token = await spotify.fetchToken();

  const result = await Promise.all(res.map(async (track) => {
    var spotifyInfo = await spotify.getTrackInfo(track.artist['#text'], track.name, "track", 1);
    track.spotify_info = await spotifyInfo;
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
