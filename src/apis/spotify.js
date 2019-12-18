const request = require("request")
const keys = require("./../../keys.json");
const token ="AQD9hTq-1hnxsqLRVYVr8TGcbPSk15PvaehVcdYv2i3_KvqIZHhdhFgzWMTu7i35RUF4CRq-3aAfJiRQ3-XAMB7S4TyFLUFE56i8DPZoMl7cConOVzYUtJPNuzF86tgmNx1afnAHx2IrjLMx0YEQZ4GdQi5fi3MZio_SYy8zQ8rOLPKvunnt8AljAg";
const trackId = "6rqhFgbbKwnb9MLmUQDhG6";
const trackUrl = "https://api.spotify.com/v1/tracks/" + trackId;
const key = keys.spotify;
const secret = keys.spotifySecret;
var access_token;

const getAccessToken = async () => { 
    request(
    {
      method: "POST",
      url: "https://accounts.spotify.com/api/token",
      form: {
        grant_type: "client_credentials"
      },
      headers: {
        Authorization: "Basic " + Buffer.from(key + ":" + secret).toString("base64"),
        Content_type: "application/x-www-form-urlencoded"
      }
    },
    function(error, response, body) {
      if (response) {
        json = JSON.parse(body);
        console.log(json);
        console.log(json.access_token);
        access_token = json.access_token;

        getTrack();
      }
      if (error) {
      }
    }
  );  
}

const getTrack = async () => {
    request(
        {
          method: "GET",
          url: trackUrl,
          headers: {
            Authorization: "Bearer " +access_token
          }
        },
        function(error, response, body) {
          if (response) {
            json = JSON.parse(body);
            console.log(json);
          }
          if (error) {
          }
        }
      );
};

module.exports = {
  getAccessToken
};
