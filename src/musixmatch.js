const fetch = require("node-fetch");
const keys = require("./../keys.json")
const http = "http://api.musixmatch.com/ws/1.1/"
const key = "&apikey=" + keys.musixmatch

const track_query = "&q_track=" + "Nothing is Safe"
const artist_query = "&q_artist=" + "clipping."
const rating_sort  = "&s_track_rating=" + "DESC"
const method = "track.search?" + track_query + artist_query + rating_sort

const url = http + method + key;

const getData = async () => {
  try {
    const response = await fetch(url);
    const json = await response.json();
    console.log(json.message.body.track_list);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
    getData
}