

function startup() {
    // set up some methods
    Meteor.methods({
        apiFilmsByName: function (actor_name) {
            console.log('api films by name!!!');
            // foo(actor_name);
            output = getApiFilmsData(actor_name);

            return output;
        },

        omdbFilmsByName:function(film_ID) {
            console.log('OMDB films by ID!');
            getOmdbFilmData(film_ID);
        }
   });
} //end startup

Meteor.startup(function () {
    startup();
});