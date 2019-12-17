const lastFM = require("./../apis/lastFM")

const getRecentTracks = async (params) => {
  return lastFM.getRecentTracks(params.username, params.limit);
}

const getRecentMbid = async (params) => {
  return "asdf"
}

module.exports = {
  getRecentTracks,
  getRecentMbid
}