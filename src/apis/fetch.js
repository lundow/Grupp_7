const fetch = require("node-fetch")

const getData = async (url) => {
  try {
    const res = await fetch(url)
    const json = await res.json()
    return json
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  getData
}