const lastFM = require("./../apis/lastFM")
const spotify = require("./../apis/spotify")

const getRecentTracks = async (params) => {

  return lastFM.getRecentTracks(params.username, params.limit);;
}

const getRecentTrackAndPoster = async (params) => {
  var res = await getRecentTracks(params);
  const token = await spotify.fetchToken();

  const result = await Promise.all( res.map(async (track) => {
    var spotifyInfo = await spotify.getTrackInfo(track.artist['#text'],track.name,"track",1);  
    track.spotify_info = await spotifyInfo; 
    return await track;
  }));
  return result;
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
  getRecentMbids,
  getRecentTrackAndPoster
}
