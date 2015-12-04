
// Meteor.call("apiFilmsByName", function(error, results) {
//     console.log(results.content); //results.data should be a JSON object
// });


loadingEvent = function(state) {
    var evt = new CustomEvent('loading', { detail: state });
    window.dispatchEvent(evt);
}

window.addEventListener('loading', function (e) {
    if (e.detail == 'start') {
        // $('body').hide();
        Router.go('loading');
    }

    if (e.detail == 'end') {
        // $('body').fadeIn(1500);
        Router.go('/results');
    }
});


Session.setDefault('actor', "");
Session.setDefault('actorSearched', false);
Session.setDefault('actorData', null);
Session.setDefault('actorMovies', null);


Template.searchApiFilms.rendered = function() {
    $('#fullpage').fullpage({
    });

    // $('.navbar').hide();
    Session.set('actor', "");
    Session.set('actorSearched', false);
    Session.set('actorData', null);
    Session.set('actorMovies', null);
};



Template.searchApiFilms.helpers({
    actor: function () {
        return Session.get('actor');
    },
    actorSearched: function () {
        return Session.get('actorSearched');
    },
    actorData: function () {
        return Session.get('actorData');
    }
});


Template.searchApiFilms.events({
    'submit .actor-form': function(event, template) {
        event.preventDefault();
        var actor = template.find("#actor-name").value;
        actor = actor.split(" ").join("+");
        console.log(actor);
        Session.set('actorSearched', true);
        Session.set('actor', actor);

        loadingEvent('start');

        Meteor.call('apiFilmsByName2', actor,
            function(error,result) {
                if(error) {
                    console.log(error);
                    return
                }

                console.log(result)
                Session.set("actorData", result[0][0] );
                Session.set(
                    "actorMovies", 
                    removeUnreleasedMovies(result[1])
                );
                loadingEvent('end');
        });
        // Router.go('/');
    },
    
    'click footer': function(event, template){
        event.preventDefault();

        var actors = [
            'Tom Waits',
            'Seth Rogen',
            'Justin Timberlake',
            'Will Smith',
            'Mark Wahlberg'
        ];
        var aLen = actors.length
        var rand = Math.random();
        //rand = 0.9999;
        rand *= aLen; //(5)
        //rand = 4.9995
        rand = Math.floor(rand);
        //rand = 4 - safely within the bounds of your array

        template.find("#actor-name").value = actors[rand] 

    }

});