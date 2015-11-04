
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



getApiFilmsData = function (actor_name) {
    console.log('actor data');
    url =(apiFilmsBaseUrl
        + "?name="
        + actor_name
        + "&token="
        + token
        + apiFilmsBaseNameSetting);
    var actorNameLower = actor_name.split("+").join("").toLowerCase();
    var checkActor = Actors.find({lowerActorName:actorNameLower}).fetch();
    console.log(checkActor);
    if(checkActor.length===0) {
        var request = Meteor.http.get(url);

        request.data.lowerActorName=actorNameLower;
        Actors.insert(request.data);
        var actor = request.data;
    }

    else {
            var actor = checkActor[0];
    }
    //console.log(actor.filmographies);
    var getMovies=actor[0].filmographies[0].filmography;
    //console.log(getMovies);
    var movies=[];

    for (i=0; i<getMovies.length; i++){
        var movie = getOmdbFilmData(getMovies[i].IMDBId)
        movies.push(movie);
        console.log('Getting Movies....');
    }

    return [actor,movies];
   // return "test";
};

