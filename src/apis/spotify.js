const api = require("./fetch.js")
const keys = require("./../../keys.json");
const token = "AQD9hTq-1hnxsqLRVYVr8TGcbPSk15PvaehVcdYv2i3_KvqIZHhdhFgzWMTu7i35RUF4CRq-3aAfJiRQ3-XAMB7S4TyFLUFE56i8DPZoMl7cConOVzYUtJPNuzF86tgmNx1afnAHx2IrjLMx0YEQZ4GdQi5fi3MZio_SYy8zQ8rOLPKvunnt8AljAg";
const key = keys.spotify;
const secret = keys.spotifySecret;
const { URLSearchParams} = require('url');
const data = new URLSearchParams();
var access_token;


/*
	Fetches an authentication token from spotify to be used when making API calls.
*/
const fetchToken = async () => {
    data.append("grant_type", "client_credentials");
    var url = 'https://accounts.spotify.com/api/token';
    var headers = {
        'Authorization': 'Basic ' + Buffer.from(key + ':' + secret).toString('base64'),
        'Content_type': 'application/x-www-form-urlencoded'
    }
    const res = await api.postData(url, headers, data);
    access_token = await res.access_token
    console.log("ACCESS_TOKEN: ",access_token);
    data.delete;
    return (access_token);
}

/*
	Requests information about a specific track from Spotify API.
	The inparameters is artist name and song title. 
	Returns an JSON object with song URL, URI and album cover image.
*/
const getTrackInfo = async (artist, title, type, limit) => {
    const query = "q=" + encode(artist) + "+" + encode(title);
    console.log(query);
    const type_query = "&type=" + type;
    const limit_query = "&limit=" + limit;
    const url = "https://api.spotify.com/v1/search?" + query + type_query + limit_query;
    const headers = {'Authorization': "Bearer " + access_token}
    const res = await api.getDataParams(url,headers);
    console.log(res);
    spotify_info={
        albumCover : res.tracks.items[0].album.images[0].url,
        uri:res.tracks.items[0].uri,
		url: res.tracks.items[0].external_urls.spotify
    }
    return spotify_info;
};

/*
	Encodes a URL string, replacing a specific sign.
	This was due to problems with song names that was not encoded properly.
*/
function encode (sURL){
    sURL = sURL.toString().replace(/%E9/,'é');
    if (decodeURIComponent(sURL) === sURL) {
      console.log("Not encoded: ", sURL)
      return encodeURIComponent(sURL)
      
    }
    console.log("Already encoded: ", sURL)
    return encodeURIComponent(decodeURIComponent(sURL));
  }
  
  /*
	Requests information about a specific album from Spotify API.
	The inparameters is artist name and album title. 
	Returns an JSON object with album cover image URL, album title and artist name.
  */
const getAlbumInfo = async(artist, albumtitle, type, limit) => {
	const query = "q=" + encode(artist) + "+" + encode(albumtitle)
	const type_query = "&type=" + type
	const limit_query = "&limit=" + limit
	const url = "https://api.spotify.com/v1/search?" + query + type_query + limit_query
	const headers = {'Authorization': "Bearer " + access_token}
	const res = await api.getDataParams(url, headers)

	spotify_info = {
		"cover": res.albums.items[0].images[0].url,
		"title": albumtitle,
		"artist": artist
	}

	return spotify_info
}

/*
	Exports modules so that you can include them in other modules using the require() method.
*/
module.exports = {
    fetchToken,
    getTrackInfo,
	getAlbumInfo
};
