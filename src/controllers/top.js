const lastFM = require("./../apis/lastFM.js")
const spotify = require("./../apis/spotify.js")
const genius = require("./../apis/genius.js")
const scraper = require("./../scraper.js")

const getTopTracks = async (params) => {
	const response = await lastFM.getTopTracks(params.username, params.limit)

	const error = response.error
	if (error === 6) {
		params.res.status(404).send("User not found")
		return
	}

	const topTracks = response.toptracks.track
	var tracks = []
	for (var i = 0; i < params.limit; i++) {
		var track = topTracks[i]
		tracks.push({
			"name": track.name,
			"artist": track.artist.name
		})
	}
	return tracks
}

const getTopLyrics = async (params) => {
	const topTracks = await getTopTracks(params)
	var tracks = []

	for (var i in topTracks) {
		var track = topTracks[i]
		var res = await genius.searchFor(track.name + " " + track.artist)
		if (res.response.hits[0] !== undefined) {
			var path = res.response.hits[0].result.path
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
				"lyrics": '404 - Lyrics not found'
			})
		}
	}
	return tracks
}

const getTopPlaycounts = async (params) => {
	const topTracks = await getTopTracks(params)
	var tracks = []

	for (var i in topTracks) {
		var track = topTracks[i]
		var trackParams = {
			"name": track.name,
			"artist": track.artist,
			"username": params.username
		}
		var trackInfo = await lastFM.getTrackInfo(trackParams)
		var playCount = trackInfo.userplaycount

		tracks.push({
			"name": track.name,
			"artist": track.artist,
			"playcount": playCount
		})
	}
	return tracks
}

const getFavouriteArtists = async (params) => {
	const favourite_artists = await lastFM.getFavouriteArtists(params.username, params.limit)
	console.log(favourite_artists)

	var artists = []
	for (var i in favourite_artists.artist) {
		var artist = favourite_artists.artist[i].name
		artists.push(artist)
		if (artists.length === 0) artists = undefined
	}
	return artists
}

const getTopAlbums = async (params) => {
	const top_albums = await lastFM.getTopAlbums(params.username, params.limit)
	var albums = []
	for (var i in top_albums) {
		var album = top_albums[i]
		var albumParams = {
			"artist": album.artist.name,
			"album": album.name
		}
		albums.push(albumParams)
	}
	return albums;
}

const getTopAlbumCovers = async (params) => {
	const albums = await getTopAlbums(params)
	const token = await spotify.fetchToken()

	var top_albums = []
	for (var i in albums) {
		const albumInfo = await spotify.getAlbumInfo(albums[i].artist, albums[i].album, "album", 1)
		top_albums.push(await albumInfo)
	}
	return top_albums
}

const getTopSpotifyLinks = async (params) => {
	const top_songs = await getFavouriteTracks(params)
	const token = await spotify.fetchToken()

	var top_song_links = []
	for (var i in top_songs) {
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
	getTopTracks,
	getTopLyrics,
	getTopPlaycounts,
	getTopAlbumCovers,
	getTopSpotifyLinks,

	getFavouriteArtists,
	getTopAlbums,
}