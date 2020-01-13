const lastFM = require("./../apis/lastFM.js")
const spotify = require("./../apis/spotify.js")
const genius = require("./../apis/genius.js")
const scraper = require("./../scraper.js")

/*
	Requests the last songs listened to on spotify from LastFM api.
	Inparameter is username and limit. The limitations is for how many tracks that is returned by LastFM.
	It returns a JSON object with track name and artist name.
*/
const getRecentTracks = async (params) => {
  const response = await lastFM.getRecentTracks(params.username, params.limit)

  const error = response.error
  if (error === 6) {
    params.res.status(404).send("404 - User not found")
    return
  }

  const recentTracks = response.recenttracks.track
  var tracks = []
  for (var i = 0; i < params.limit; i++) {
    var track = recentTracks[i]
    tracks.push({
      "name": track.name,
      "artist": track.artist['#text']
    })
  }
  return tracks
}

/*
	Fetches the song lyrics for the recent tracks, by scraping the lyrics from Genius API.
	It returns a JSON object with song name, artist name and lyrics to the corresponding songs.
*/
const getRecentLyrics = async (params) => {
  const recentTracks = await getRecentTracks(params)
  var tracks = []

  for (var i in recentTracks) {
    var track = recentTracks[i]
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
	Fetches information about how many times recent songs have been played. E.g. the play count.
	Returns a JSON object with trackinformation such as track name, artist name and play count.
*/
const getRecentPlaycounts = async (params) => {
  const recentTracks = await getRecentTracks(params)
  var tracks = []

  for (var i in recentTracks) {
    var track = recentTracks[i]
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
	Fetches the covers of the recent songs listened to from Spotify API. 
*/
const getRecentAlbumCovers = async (params) => {
  var res = await getRecentTracks(params);
  const token = await spotify.fetchToken();

  const result = await Promise.all(res.map(async (track) => {
    var spotifyInfo = await spotify.getTrackInfo(track.artist, track.name, "track", 1);
    track.albumCover = await spotifyInfo.albumCover;
    return await track;
  }));
  return result;
}

/*
	Fetches the song links to the songs listened to recently.
*/
const getRecentSpotifyLinks = async (params) => {
  var res = await getRecentTracks(params);
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
  getRecentTracks,
  getRecentLyrics,
  getRecentPlaycounts,
  getRecentAlbumCovers,
  getRecentSpotifyLinks,
}
