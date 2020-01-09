const lastFM = require("./../apis/lastFM.js")
const spotify = require("./../apis/spotify.js")

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

const getTopAlbums = async(params) => {
	const top_albums = await lastFM.getTopAlbums(params.username, params.limit)
	var albums = []
	for(var i in top_albums) {
		var album = top_albums[i]
		var albumParams = {
			"artist": album.artist.name,
			"album": album.name
		}
		albums.push(albumParams)
	}
	return albums;
}

const getTopAlbumCovers = async(params) => {
	const albums = await getTopAlbums(params)
	const token = await spotify.fetchToken()

	var top_albums = []
	for(var i in albums) {
		const albumInfo = await spotify.getAlbumInfo(albums[i].artist, albums[i].album, "album", 1)
		top_albums.push(await albumInfo)
	}
	return top_albums
}

module.exports = {
	getFavouriteTracks,
	getFavouriteArtists,
	getTopAlbums,
	getTopAlbumCovers
}