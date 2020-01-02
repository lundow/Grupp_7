const lastFM = require("./../apis/lastFM.js")
const spotify = require("./../apis/spotify.js")
const genius = require("./../apis/genius.js")

const getRecentTracks = async (params) => {
  const lastFM_tracks = await lastFM.getRecentTracks(params.username, params.limit - 1)
  var tracks = []
  
  for (var i in lastFM_tracks) {
    var track = {
      "name": lastFM_tracks[i].name,
      "artist": lastFM_tracks[i].artist['#text'],
      "album": lastFM_tracks[i].album['#text']
    }
    tracks.push(track)
  }
  return tracks
}

const getRecentLyrics = async (params) => {
  const recentTracks = await getRecentTracks(params)
  var paths = []

  for(var i in recentTracks){
    var track = recentTracks[i]
    var res = await genius.searchFor(track.name + " " + track.artist)
    var path = res.hits[0].result.path
    paths.push(path)
  }
  return paths
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
  getRecentTracks,
  getRecentLyrics,
  getFavouriteTracks,
  getRecentTrackAndPoster,
}
