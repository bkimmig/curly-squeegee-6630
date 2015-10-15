
var apiFilmsBaseUrl = "http://www.myapifilms.com/imdb";

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
    console.log('actor data')
    url = apiFilmsBaseUrl + "?name=" + actor_name + apiFilmsBaseNameSetting;
    request = Meteor.http.get(url);
    // put it in the mongo db
    Actors.insert(request.data)
};
