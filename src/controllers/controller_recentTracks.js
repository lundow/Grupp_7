const lastFM = require("./../apis/lastFM")

const getRecentTracks = async (params) => {
  lastFM.getRecentTracks(params.username, params.limit);
}

module.exports = {
  getRecentTracks
}