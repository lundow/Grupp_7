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

  response = await fetch(url + "recent/tracks?limit=5" + username_query)
  if (!checkResponsStatus(response)) return
  json = await response.json()

  var tracks = []
  for(var i in json) {
  	  tracks[i] = json[i]
  }


  //Varför containern appenda denna ovan, men inte här? Komponenterna i varje list-item försvinner, medan
  //den som appendar ovan får med alla komponenter. 
  for(var i in tracks) {
  	  $(".container .list").append(lyricsComponent)
  }

  //Ger varje list item i listan ett id
  var index = 0;
  for(var i in tracks) {
  	  $("li").eq(index).attr("id", index)
	  index++
  }

 var count = 0
  for(var i in tracks) {
  	 
	 // $(".list-item").attr("id", count)

	 //List-item med #count(id:t) får text
	  $("#"+count + ", .songname").text(tracks[i].name)
	  $("#"+count + ", .artistname").text("av " + tracks[i].artist)

	  const track_query = "&track=" + tracks[i].name
	  const artist_query = "&artist=" + tracks[i].artist

	   response = await fetch(url + "search/playcount?" + username_query + track_query + artist_query)
	  if (!checkResponsStatus(response)) return
	  json = await response.json()
	  var playcount = json.playcount

	  $("#"+count+", .playcount").text(playcount + "st tidigare lyssningar")

	   // //Fetching Spotify link
	  response = await fetch(url + "search/link?" + track_query + artist_query)
	  if(!checkResponsStatus(response)) return
	  json = await response.json()
	  var spotify_uri = json.uri.substring(14)

	  //Inserts data in Lyrics Header e.g. artistname, trackname
	  console.log(spotify_src + spotify_uri)
	  $("#"+count+", .spotify").attr("src", spotify_src + spotify_uri)
	  //Then fade in
	  $("#"+count+", .header-wrapper").fadeIn(1500)
	  count++

  }
  /*
  response = await fetch(url + "search/lyrics?" + track_query + artist_query)
  if (!checkResponsStatus(response)) return
  json = await response.json()
  var lyrics = json.lyrics

  $(".lyrics .text").text(lyrics)
  $(".lyrics .text-wrapper").fadeIn(1500)
    */

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
	"<li class=\"list-item lyrics\">" +
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
	"</li>" 
