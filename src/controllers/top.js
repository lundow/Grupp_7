const lastFM = require("./../apis/lastFM.js")

const getFavouriteTracks = async (params) => {
  const favourite_tracks = await lastFM.getFavouriteTracks(params.username, params.limit)

  var tracks = []
  for (var i in favourite_tracks["track"]) {
    var track = favourite_tracks.track[i];
    if (track.length === 0) track = undefined
    tracks.push(track)
  }
  return tracks
}

const getFavouriteArtists = async(params) => {
	const favourite_artists = await lastFM.getFavouriteArtists(params.username, params.limit)
		console.log(favourite_artists)

	var artists = []
	for(var i in favourite_artists.artist) {
		var artist = favourite_artists.artist[i].name
		artists.push(artist)
		if(artists.length === 0) artists = undefined
	}
	return artists
}

module.exports = {
	getFavouriteTracks,
	getFavouriteArtists
}