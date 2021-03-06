var omdbFilmsBaseUrl = "http://www.omdbapi.com/";

var omdbFilmsBaseNameSetting = (
    "&y=yes" +
    "&r=json" +
    "&plot=short" +
    "&tomatoes=true"
);

getOmdbFilmData = function (film_id) {
    var url = omdbFilmsBaseUrl + "?i=" + film_id + omdbFilmsBaseNameSetting;

    // put it in the mongo db
    var checkMovie = Movies.find({imdbID:film_id}).fetch();

    if(checkMovie.length===0) {
        var request = Meteor.http.get(url);
        Movies.insert(request.data);
        var movie = request.data;
        console.log('movie data request');
    } else {
        var movie = checkMovie[0];
        console.log('movie data db');
    }

    return movie;

};