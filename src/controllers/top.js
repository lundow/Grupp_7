const lastFM = require("./../apis/lastFM.js")
const spotify = require("./../apis/spotify.js")
const genius = require("./../apis/genius.js")
const scraper = require("./../scraper.js")

/*
	Requests the most listened songs from Last FM api.
	Inparameters is a username and limitations on how many songs the user wants to fetch.
	Returns a JSON object with the song name and song artists.
*/
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

/*
	Fetches the lyrics for the most listened songs from Genius API.
	Returns a JSON object with song name, song artists and song lyrics.
*/
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

/*
	Fetches information about how many times the most played songs have been played. E.g. the play count.
	Returns a JSON object with trackinformation such as track name, artist name and play count.
*/
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

/*
	Requests the most listened to artists from LastFM api.
	Return a JSON object with the artists.
*/
const getFavouriteArtists = async (params) => {
	const favourite_artists = await lastFM.getTopArtists(params.username, params.limit)
	//console.log(favourite_artists)

	var artists = []
	for (var i in favourite_artists.artist) {
		var artist = favourite_artists.artist[i].name
		artists.push({"artist":artist})
		if (artists.length === 0) artists = undefined
	}
	return artists
}

/*
	Fetches the most listened to albums from the LastFM api.
	Inparameters is the username and limitations on how many albums we want to retrieve.
	Returns a JSON object with artist name and album name.
*/
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

/*
	Fetches album covers for the most listened to albums from the Spotify api.
	Returns a JSON object with top album information.
*/
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

/*
	Fetches the spotify links of the most listened to songs from Spotify api.
	Returns track information like track artist name, track name and spotify URI and URL.
*/
const getTopSpotifyLinks = async (params) => {
  var res = await getTopTracks(params);
  const token = await spotify.fetchToken();

  const result = await Promise.all(res.map(async (track) => {
    var spotifyInfo = await spotify.getTrackInfo(track.artist, track.name, "track", 1);
    track.spotifyURI = await spotifyInfo.uri;
    return await track;
  }));
  return result;
}

/*
	Exports modules so that you can include them in other modules using the require() method.
*/
module.exports = {
	getTopTracks,
	getTopLyrics,
	getTopPlaycounts,
	getTopAlbumCovers,
	getTopSpotifyLinks,

	getFavouriteArtists,
	getTopAlbums,
}