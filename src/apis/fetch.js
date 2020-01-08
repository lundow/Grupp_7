const fetch = require("node-fetch")

/*
	Sends a GET request to the given URL.
*/
const getData = async (url) => {
  try {
    const res = await fetch(url)
    const json = await res.json()
    return json
  } catch (error) {
    console.log(error)
  }
}

/*
	
*/
const getDataParams = async (url, headers) => {
  try {
    const res = await fetch(url, { method: 'GET', headers: headers });
    const json = await res.json()
    return json
  } catch (error) {
    console.log(error)
  }
}

/*
	Sends a POST request to the given URL, inparameters is url, headers and data. 
*/
const postData = async (url, headers, data) => {
  try {
    const res = await fetch(url, { method: 'POST', headers: headers, body: data })
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
