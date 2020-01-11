const fetch = require("node-fetch")

/*
	Sends a GET request to the given URL.
*/
const getData = async (uri) => {
  try {
    const res = await fetch(uri)
    const json = await res.json()
    return json
  } catch (error) {
    console.log(error)
  }
}

const getDataParams = async (uri, headers) => {
  try {
    const res = await fetch(uri, { method: 'GET', headers: headers });
    const json = await res.json()
    return json
  } catch (error) {
    console.log(error)
  }
}

/*
	Sends a POST request to the given URL, inparameters is url, headers and data. 
*/
const postData = async (uri, headers, data) => {
  try {
    const res = await fetch(uri, { method: 'POST', headers: headers, body: data })
    const json = await res.json()
    return json
  } catch (error) {
    console.log(error)
  }
}

/*
	Exports modules so that you can include them in other modules using the require() method.
*/
module.exports = {
  getData,
  getDataParams,
  postData
}
