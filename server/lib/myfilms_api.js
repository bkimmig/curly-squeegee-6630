

var apiFilmsBaseUrl = "http://www.myapifilms.com/imdb/idIMDB";
var token = process.env.API_FILMS_TOKEN;

var apiFilmsBaseNameSetting = (
        "&format=json" +
        "&filmography=1" 
        // "&limit=1" +
        // "&lang=en-us" +
        // "&exactFilter=0" +
        // "&bornDied=0" +
        // "&starSign=0" +
        // "&uniqueName=0" +
        // "&actorActress=0" +
        // "&actorTrivia=0" +
        // "&actorPhotos=N" +
        // "&actorVideos=N" +
        // "&salary=1" +
        // "&spouses=1" +
        // "&tradeMark=0" +
        // "&personalQuotes=0" +
        // "&starMeter=0"
);

getApiFilmsData = function (actor_name, callback) {
    console.log('actor data');
    url =(apiFilmsBaseUrl
        + "?name="
        + actor_name
        + "&token="
        + token
        + apiFilmsBaseNameSetting);
    var actorNameLower = actor_name.split("+").join("").toLowerCase();
    var checkActor = Actors.find({lowerActorName: actorNameLower}).fetch();
    if(checkActor.length === 0) {
        var request = Meteor.http.get(url);
        var names = request.data.data.names
        names[0].lowerActorName = actorNameLower;
        Actors.insert(names);
        
        var actor = names;
    } else {
            var actor = checkActor[0];
    }
    
    //console.log(actor.filmographies);
    var filmog = actor[0].filmographies
    for(var i=0; i<filmog.length; i++) {
        console.log(filmog[i])
        if (filmog[i].section === "Actor" || filmog[i].section === "Actress") {
            var getMovies = filmog[i].filmography;
            break;
        }
    }

    // var getMovies=actor[0].filmographies[0].filmography;
    //console.log(getMovies);
    var movies=[];

    for (var i=0; i<getMovies.length; i++){
        var movie = getOmdbFilmData(getMovies[i].IMDBId)
        movies.push(movie);
    }
    console.log('Done Getting Movies....');
    
    if (callback) {
        callback([actor,movies])
    } else {
        return [actor,movies];
    }
};

