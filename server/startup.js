var Future = Npm.require( 'fibers/future' ); 

foo = function(bar) {
    console.log(bar);
}

function startup() {
    // set up some methods
    Meteor.methods({
        apiFilmsByName: function (actor_name) {
            console.log('api films by name!!!');
            output = getApiFilmsData(actor_name);
            return output;
        },

        omdbFilmsByName:function(film_ID) {
            console.log('OMDB films by ID!');
            getOmdbFilmData(film_ID);
        },
        
        apiFilmsByName2: function (actor_name) {
            console.log('api films by name!!!');

            var future = new Future();

            getApiFilmsData(actor_name, function(error, response) {     
                // Meteor._sleepForMs(2000);
                if ( error ) {
                    future.return( error );
                } else {
                    future.return( response );
                }
            });
            return future.wait();
        }
   });
} //end startup

Meteor.startup(function () {
    startup();
});