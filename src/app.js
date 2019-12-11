const fetch = require("node-fetch");
const url = "http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=Buden1&api_key=85a08404eb8263816ff64778b152d8e3&format=json"

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