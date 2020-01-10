const lastFM = require("./../apis/lastFM.js")
const spotify = require("./../apis/spotify.js")

const getFavouriteTracks = async (params) => {
  const favourite_tracks = await lastFM.getFavouriteTracks(params.username, params.limit)

  var tracks = []
  for (var i in favourite_tracks["track"]) {
	var track = favourite_tracks.track[i];
	if (track.length === 0) track = undefined
	
	console.log("TRACK: ", track)
    tracks.push({
		"name": track.name,
		"artist": track.artist.name
		})
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

const getTopLinks = async(params) => {
	const top_songs = await getFavouriteTracks(params)
	const token = await spotify.fetchToken()

	var top_song_links = []
	for(var i in top_songs) {
		const song_name = top_songs[i].name
		const song_artist = top_songs[i].artist.name
		const track = await spotify.getTrackInfo(song_artist, song_name, "track", params.limit)

		song_info = {
			"song_name": song_name,
			"song_artist": song_artist,
			"song_url": track.url
		}
		top_song_links.push(song_info)
	}
	return top_song_links
}

module.exports = {
	getFavouriteTracks,
	getFavouriteArtists,
	getTopAlbums,
	getTopAlbumCovers,
	getTopLinks
}