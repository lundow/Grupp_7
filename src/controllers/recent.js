const lastFM = require("./../apis/lastFM")

const getRecentTracks = async (params) => {
  return lastFM.getRecentTracks(params.username, params.limit)
}

const getRecentMbids = async (params) => {
  const tracks = await lastFM.getRecentTracks(params.username, params.limit)
  var mbids = []
  for (var i in tracks) {
    var mbid = tracks[i]["mbid"]
    //undefined = missing mbid from lastFM
    if (mbid.length === 0) mbid = undefined
    mbids.push(mbid)
  }
  return mbids
}

const getFavouriteTracks = async (params) => {
  const favourite_tracks = await lastFM.getFavouriteTracks(params.username, params.limit)

  var tracks = []
  for(var i in favourite_tracks["track"]) {
    var track = favourite_tracks.track[i];
    if(track.length === 0) track = undefined
    tracks.push(track)

    //console.log(favourite_tracks.track[i].name) - namn på låt
    //console.log(favourite_tracks.track[i].artist.name) - namn på artist

  }
  return tracks
}

module.exports = {
  getRecentTracks,
  getRecentMbids,
  getFavouriteTracks
}