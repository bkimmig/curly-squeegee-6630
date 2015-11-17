Template.results.helpers({
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


Template.results.rendered = function () {
    $('.navbar').show();
    gv = new GenreVis(d3.selectAll('#genreVis'), Session);
}