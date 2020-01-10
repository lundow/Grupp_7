//Our API
const url = "http://localhost:8000/"

//Embeding Spotify
const spotify_src = "https://open.spotify.com/embed/track/"

async function search() {
  var response = {}, json = {}

  //Reset page if needed
  if($(".lyrics").length) $(".lyrics").fadeOut(1500)

  //Inserts the Lyrics Component
  $(".container").append(lyricsComponent)

  //Fetching most recent track
  const username_query = "&username=" + $("#username-field").val()

  response = await fetch(url + "recent/tracks?limit=1" + username_query)
  if (!checkResponsStatus(response)) return
  json = await response.json()
  var recentTrack = json[0]

  $(".lyrics .songname").text(recentTrack.name)
  $(".lyrics .artistname").text("av " + recentTrack.artist)

  //Fetching playcount
  const track_query = "&track=" + recentTrack.name
  const artist_query = "&artist=" + recentTrack.artist

  response = await fetch(url + "search/playcount?" + username_query + track_query + artist_query)
  if (!checkResponsStatus(response)) return
  json = await response.json()
  var playcount = json.playcount

  $(".lyrics .playcount").text(playcount + "st tidigare lyssningar")

  // //Fetching Spotify link
   response = await fetch(url + "search/link?" + track_query + artist_query)
   if(!checkResponsStatus(response)) return
   json = await response.json()
   var spotify_uri = json.uri.substring(14)

  //Inserts data in Lyrics Header e.g. artistname, trackname

  
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
