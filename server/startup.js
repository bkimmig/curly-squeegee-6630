

function startup() {
    // set up some methods
    Meteor.methods({
        apiFilmsByName: function (actor_name) {
            console.log('api films by name!!!');
            // foo(actor_name);
            getApiFilmsData(actor_name);
        }
    });
}


Meteor.startup(function () {
    startup();
});