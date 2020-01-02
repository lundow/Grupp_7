const api = require("./fetch.js")
const keys = require("./../../keys.json")
const url = "http://api.genius.com/"
const key = "&access_token=" + keys.genius

const searchFor = async (searchTerm) => {
  const method = "search?q=" + searchTerm
  console.log(searchTerm)
  const req_url = url + method + key

  return await api.getData(req_url)
}

module.exports = {
  searchFor
}