
//Our API
const url = "http://localhost:8000/"

//Spotify component
const spotify_src = "https://open.spotify.com/embed/track/"

var response = {}, json = {}
var toggled = false;
var search_type = "recent";

function search() {
  console.log("search")
  //Reset page if needed
  if ($(".lyrics").length){
    $(".lyrics").fadeOut(1500)
    window.setTimeout(fetchFromAPI(), 5000)
  } else {
    fetchFromAPI()
  }
}

async function fetchFromAPI() {
  //Inserts a new lyricsComponent
  $(".container").append(lyricsComponent)
  //Fetching most recent track
  const username_query = "&username=" + $("#username-field").val()

  response = await fetch(url + search_type + "/tracks?limit=1" + username_query)
  if (!checkResponsStatus(response)) return
  json = await response.json()
  var recentTrack = json[0]
  console.log(json[0]);

  $(".lyrics .songname").text(recentTrack.name)
  $(".lyrics .artistname").text("av " + recentTrack.artist)

  //Fetching playcount
  const track_query = "&track=" + escape(recentTrack.name)
  const artist_query = "&artist=" + escape(recentTrack.artist)

  response = await fetch(url + "search/playcount?" + username_query + track_query + artist_query)
  console.log(response)
  if (!checkResponsStatus(response)) return
  json = await response.json()
  var playcount = json.playcount

  $(".lyrics .playcount").text(playcount + "st tidigare lyssningar")

  //Fetching Spotify link
  response = await fetch(url + "search/link?" + track_query + artist_query)
  if (!checkResponsStatus(response)) return
  json = await response.json()
  var spotify_uri = json.uri.substring(14)

  $(".lyrics .spotify").attr("src", spotify_src + spotify_uri)

  //Then fade in
  $(".lyrics .header-wrapper").fadeIn(1500)

  response = await fetch(url + "search/lyrics?" + track_query + artist_query)
  if (!checkResponsStatus(response)) return
  json = await response.json()
  var lyrics = json.lyrics

  $(".lyrics .text").text(lyrics)
  $(".lyrics .text-wrapper").fadeIn(1500)
}

function checkResponsStatus(response) {
  if (response.status === 200) {
    $("#error-message").html("")
    return true
  } else {
    $("#error-message").html("<p>" + response.statusText + "</p>")
    return false
  }
}

function toggle() {
  if (!toggled) {
    $("#search-type").text("Topp");
    search_type = "top";
  } else {
    $("#search-type").text("Senaste");
    search_type = "recent";
  }
  toggled = !toggled;
}

const lyricsComponent =
  "<div class=\"lyrics\">" +
  "<div class=\"header-wrapper hidden\">" +
  "<div class=\"header\">" +
  "<iframe class=\"spotify\"></iframe>" +
  "<div class=\"right\">" +
  "<span class=\"songname\"></span>" +
  "<span class=\"artistname\"></span>" +
  "<span class=\"playcount\"></span>" +
  "</div>" +
  "</div>" +
  "</div>" +
  "<div class=\"text-wrapper hidden\">" +
  "<span class=\"text hidden\"></span>" +
  "</div>" +
  "</div>"

