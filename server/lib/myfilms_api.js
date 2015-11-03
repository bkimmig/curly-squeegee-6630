
var apiFilmsBaseUrl = "http://www.myapifilms.com/imdb";
var token = "9e629371-9768-407f-9c55-3006871ca428";

var apiFilmsBaseNameSetting = (
        "&format=JSON" +
        "&filmography=1" + 
        "&limit=1" +
        "&lang=en-us" +
        "&exactFilter=0" +
        "&bornDied=0" +
        "&starSign=0" +
        "&uniqueName=0" +
        "&actorActress=0" +
        "&actorTrivia=0" +
        "&actorPhotos=N" +
        "&actorVideos=N" +
        "&salary=1" +
        "&spouses=1" +
        "&tradeMark=0" +
        "&personalQuotes=0" +
        "&starMeter=0"
);

var apiFilmsBaseImdbBaseSetting = (
        "&format=json" +
        "&language=en-us" +
        "&aka=0" +
   //     "&business=0" +
   //     "&seasons=0" +
        "&seasonYear=0" +
        "&technical=0" +
   //     "&trailer=0" +
   //     "&movieTrivia=0" +
        "&awards=0" +
        "&moviePhotos=0" +
  //      "&movieVideos=0" +
        "&actors=0" +
        "&biography=0" +
        "&uniqueName=0" +
  //      "&filmography=0" +
  //      "&bornAndDead=0" +
        "&starSign=0"+
        "&actorActress=0" +
  //      "&actorTrivia=0" +
        "&similarMovies=0"
);

getApiFilmsData = function (actor_name) {
    console.log('actor data');
    url = apiFilmsBaseUrl + "?name=" + actor_name + "&token=" + token + apiFilmsBaseNameSetting;
    request = Meteor.http.get(url);
    // put it in the mongo db
    Actors.insert(request.data);
        console.log(request.data)
};

getApiMovieData = function (film_id) {
        console.log('movie data');

        //Change below to search based on film name vvvvv
        url = apiFilmsBaseUrl + "/idIMDB?idIMDB=%" + film_id +"%22&token=" + token  + apiFilmsBaseImdbBaseSetting;
        request = Meteor.http.get(url);
        // put it in the mongo db
        Movies.insert(request.data)
};