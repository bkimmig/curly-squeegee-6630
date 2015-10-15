
Meteor.publish('actors', function() {
    return Actors.find();
});