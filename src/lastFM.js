const fetch = require("node-fetch");
const keys = require("./../keys.json")
const http = "http://ws.audioscrobbler.com/2.0/"
const method = "?method=" + "user.getrecenttracks"
const username = "&user=" + "Buden1"
const key = "&api_key=" + keys.lastFM
const format = "&format=" + "json"

const url = http + method + username + key + format;

const getData = async url => {
  try {
    const response = await fetch(url);
    const json = await response.json();
    console.log(json);
  } catch (error) {
    console.log(error);
  }
};

getData(url);