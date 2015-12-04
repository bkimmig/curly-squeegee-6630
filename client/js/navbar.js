Template.navbar.helpers({
    actor: function () {
        return Session.get('actor');
    },
    actorSearched: function () {
        return Session.get('actorSearched');
    },
    actorData: function () {
        return Session.get('actorData');
    },
    nMovies: function () {
        return Session.get('actorMovies').length;
    },
    actorPhoto: function(){
        return Session.get('actorData').urlPhoto;
    }

});

Template.navbar.events({
    'click #button': function(event, template){
        event.preventDefault();
        var actorImage = $('img')
        actorImage.src = Session.get('actorData').urlPhoto;
        console.log($('img'))
    },

})


// Template.navbar.rendered = function(){
//     var actorImage = $('img')
//     actorImage.src = Session.get('actorData').urlPhoto;
//     console.log($('img'))
// }