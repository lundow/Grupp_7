const api = require("./fetch.js")
const keys = require("./../../keys.json")
const url = "http://ws.audioscrobbler.com/2.0/"
const key = "&api_key=" + keys.lastFM
const format = "&format=json"

/*
	Sends a request to the LastFM api asking for the recent tracks of a specific user.
	Inparameters is username and limitations on how many tracks we want to retrieve.
*/
const getRecentTracks = async (username, limit) => {
  const limit_query = "&limit=" + limit
  const user_query = "&user=" + username

  const method = "?method=user.getrecenttracks" + limit_query + user_query
  const req_url = url + method + key + format

  return await api.getData(req_url)
}



function encode (sURL){
  sURL = sURL.toString().replace(/%E9/,'é');
  if (decodeURIComponent(sURL) === sURL) {
    return encodeURIComponent(sURL)
  }
  return encodeURIComponent(decodeURIComponent(sURL));
}
/*
	Sends a request to the LastFM api asking for the information about a specific track. 
	Inparameters is user, artist name and song name. Provides information such as
	duration, playcount, url, toptags, album e.t.c.
*/
const getTrackInfo = async (params) => {
  const name = encode(params.name);
  const artist = encode(params.artist);
  const track_query = "&track=" + name
  const artist_query = "&artist=" + artist
  const user_query = "&user=" + params.username

  const method = "?method=track.getInfo" + user_query + track_query + artist_query
  const req_url = url + method + key + format

  const json = await api.getData(req_url)
  const info = json.track
  return info
}

/*
	Sends a request to the LastFM api asking for the information about a specific user. 
	Inparameters is the username, and provides information such as name, id, real name, country, age, gender, playcount e.t.c.
*/
const getUserInfo = async (params) => {
  const user_query = "&user=" + params.username

  const method = "?method=user.getInfo" + user_query
  const req_url = url + method + key + format

  return await api.getData(req_url)
}

/*
	Sends a request to the lastFM api asking for the favourite tracks. The inparameters is username and limitations,
	depending on how many favourite tracks we want to retrieve.
*/
const getTopTracks = async (username, limit) => {
  const limit_query = "&limit=" + limit
  const user_query = "&user=" + username

  const method = "?method=user.gettoptracks" + limit_query + user_query
  const req_url = url + method + key + format

  return await api.getData(req_url)
}

/*
	Sends a request to the LastFM api asking for the favourite artists of all times. Period is optional but not added.
	Parameters is username and the limitations of how many artists we want to retrieve.
*/
const getTopArtists = async (username, limit) => {
	const user_query = "&user=" + username
	const limit_query = "&limit=" + limit

	const method = "?method=user.gettopartists" + user_query + limit_query
	const req_url = url + method + key + format

	const json = await api.getData(req_url)

	const favourite_artists = json.topartists
	return favourite_artists
}

const getTopAlbums = async(username, limit) => {
	const user_query = "&user=" + username
	const limit_query = "&limit=" + limit

	const method = "?method=user.gettopalbums" + user_query + limit_query
	const req_url = url + method + key + format

	const json = await api.getData(req_url)
	const top_albums = json.topalbums.album
	return top_albums
}

/*
	Exports modules so that you can include them in other modules using the require() method.
*/
module.exports = {
  getRecentTracks,
  getTrackInfo,
  getUserInfo,
  getTopTracks,
  getTopArtists,
  getTopAlbums
}
