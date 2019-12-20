const api = require("./fetch.js")
const keys = require("./../../keys.json")
const url = "http://api.genius.com/"
const key = "&access_token=" + keys.genius

const searchFor = async (searchTerm) => {
  const method = "search?q=" + searchTerm
  const req_url = url + method + key

  const json = await api.getData(req_url)
  return json
}

module.exports = {
  searchFor
}