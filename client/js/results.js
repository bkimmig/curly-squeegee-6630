Template.results.helpers({
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


Template.results.rendered = function () {
    $('.navbar').show();
    gv = new GenreVis(d3.selectAll('#genreVis'), Session);
    pcv = new ParallelCoordVis(d3.selectAll('#parallelCoordVis'), Session);
    tlv = new  TimelineVis(d3.selectAll('#timelineVis'), Session);
}
