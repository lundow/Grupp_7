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

module.exports = {
  getRecentTracks,
  getRecentMbids
}