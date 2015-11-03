
Meteor.publish('actors', function() {
    return Actors.find();
});

Meteor.publish('movies', function() {
    return Movies.find();
});