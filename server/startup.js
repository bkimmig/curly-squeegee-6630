

function startup() {
    // set up some methods
    Meteor.methods({
        apiFilmsByName: function (actor_name) {
            console.log('api films by name!!!');
            // foo(actor_name);
            getApiFilmsData(actor_name);
        }
    });


    Meteor.methods({
        apiMovieDataByTitle: function (film_name) {
            console.log('Movie data by title!!!');
            // foo(filme_name);
            getApiMovieData(film_name);
        }
    });
}


Meteor.startup(function () {
    startup();
});