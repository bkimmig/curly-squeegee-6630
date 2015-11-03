
// Meteor.call("apiFilmsByName", function(error, results) {
//     console.log(results.content); //results.data should be a JSON object
// });

Session.setDefault('actor', "");
Session.setDefault('actorSearched', false);
Session.setDefault('actorData', null);


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

// data = null;
Template.searchApiFilms.events({
    'submit .actor-form': function(event, template) {
        event.preventDefault();
        var actor = template.find("#actor-name").value;
        actor = actor.split(" ").join("+");
        console.log(actor);
        Session.set('actorSearched', true);
        Session.set('actor', actor);
        // Meteor.call('apiFilmsByName', actor, function(error, request) {
        //     console.log(request);
        //     Session.set('actorData', request);
        //     data = request.data;
        // });
        Meteor.call('apiFilmsByName', actor);

        // Router.go('/');
    }
});