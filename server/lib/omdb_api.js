var omdbFilmsBaseUrl = "http://www.omdbapi.com/";

var omdbFilmsBaseNameSetting = (
    "&y=yes" +
    "&r=json" +
    "&plot=short" +
    "&tomatoes=true"
);
getApiMovieData = function (film_id) {
    console.log('movie data');
    var url = omdbFilmsBaseUrl + "?i=" + film_id + omdbFilmsBaseNameSetting;
    var request = Meteor.http.get(url);
    // put it in the mongo db
    Movies.insert(request.data)
};