const api = require("./fetch.js")
const keys = require("./../../keys.json")
const url = "http://api.genius.com/"
const key = "&access_token=" + keys.genius

/*
	Sends a request to the Genius API.
*/
const searchFor = async (searchTerm) => {
  const method = "search?q=" + escape(searchTerm)
  const req_url = url + method + key

  return await api.getData(req_url)
}

/*
	Exports modules so that you can include them in other modules using the require() method.
*/
module.exports = {
  searchFor
}