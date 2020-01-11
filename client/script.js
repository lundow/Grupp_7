
//Our API
const url = "http://localhost:8000/"
const LIMIT = 5

//Spotify component
const spotify_src = "https://open.spotify.com/embed/track/"

var response = {}, json = {}
var tracks = []
var toggled = false;
var search_type = "recent";

function search() {
  //Reset page if needed
  if ($(".list").length) {
    $(".lyrics").fadeOut(1500)
    window.setTimeout(() => {
      $(".list").empty()
      fetchFromAPI()
    }, 1500)
  } else {
    fetchFromAPI()
  }
}

async function fetchFromAPI() {
  //Fetching most recent tracks
  const username_query = "&username=" + $("#username-field").val()
  response = await fetch(url + search_type + "/tracks?limit=" + LIMIT + username_query)
  if (!checkResponsStatus(response)) return
  tracks = await response.json()

  for (var i in tracks) {
    //Inserts a new lyricsComponent
    $(".list").append(lyricsComponent(i))
    $("#" + i + " .songname").text(tracks[i].name)
    $("#" + i + " .artistname").text("av " + tracks[i].artist)
    
    //Fetching playcounts
    const track_query = "&track=" + escape(tracks[i].name)
    const artist_query = "&artist=" + escape(tracks[i].artist)
    
    response = await fetch(url + "search/playcount?" + username_query + track_query + artist_query)
    if (!checkResponsStatus(response)) return
    json = await response.json()
    var playcount = json.playcount
    $("#" + i + " .playcount").text(playcount + "st tidigare lyssningar")

    // Fetching Spotify links
    response = await fetch(url + "search/link?" + track_query + artist_query)
    console.log(response)
    if (!checkResponsStatus(response)) return
    var json = await response.json()
    var spotify_uri = json.uri.substring(14)
    
    $("#" + i + " .spotify").attr("src", spotify_src + spotify_uri)
     
    $("#" + i).fadeIn(1500)
    $("#" + i + " .header-wrapper").fadeIn(1500)
  }

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

async function displayLyrics(item_id){
  const id = $(item_id).attr("id");
  console.log(id);
  if($("#" + id + " .text").text().length>0){
    $("#" + id + " .text-wrapper").fadeOut(1500)
  }
  else {
    const track_query = "&track=" + escape(tracks[id].name)
    const artist_query = "&artist=" + escape(tracks[id].artist)
  
    // Fetching Lyrics
    response = await fetch(url + "search/lyrics?" + track_query + artist_query);
    if (!checkResponsStatus(response)) return
    var json = await response.json()
    console.log(json);
  
    $("#" + id + " .text").text(json.lyrics);
    $("#" + id + " .text-wrapper").fadeIn(1500)
  }
}

function lyricsComponent(id) {
  return "<div class=\"lyrics\" onclick='displayLyrics(this)' id=\"" + id + "\">" +
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
}

