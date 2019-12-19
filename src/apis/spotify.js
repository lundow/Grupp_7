const api = require("./fetch.js")
const keys = require("./../../keys.json");
const token = "AQD9hTq-1hnxsqLRVYVr8TGcbPSk15PvaehVcdYv2i3_KvqIZHhdhFgzWMTu7i35RUF4CRq-3aAfJiRQ3-XAMB7S4TyFLUFE56i8DPZoMl7cConOVzYUtJPNuzF86tgmNx1afnAHx2IrjLMx0YEQZ4GdQi5fi3MZio_SYy8zQ8rOLPKvunnt8AljAg";
const key = keys.spotify;
const secret = keys.spotifySecret;
const { URLSearchParams} = require('url');
const data = new URLSearchParams();
var access_token;


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

const getAlbumCover = async (artist, title, type, limit) => {
    const query = "q=" + artist + "+" + title;
    const type_query = "&type=" + type;
    const limit_query = "&limit=" + limit;
    const url = "https://api.spotify.com/v1/search?" + query + type_query + limit_query;
    const headers = {'Authorization': "Bearer " + access_token}
    const res = await api.getDataParams(url,headers);
    
    const albumCover = res.tracks.items[0].album.images[0].url;
    console.log("ALBUM_COVER: ", albumCover);
    return albumCover;
};

module.exports = {
    fetchToken,
    getAlbumCover
};