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

const getDataParams = async (url, headers) => {
  try {
    const res = await fetch(url, { method: 'GET', headers: headers });
    const json = await res.json()
    return json
  } catch (error) {
    console.log(error)
  }
}

const postData = async (url, headers, data) => {
  try {
    const res = await fetch(url, { method: 'POST', headers: headers, body: data })
    const json = await res.json()
    return json
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  getData,
  postData,
  getDataParams
}
